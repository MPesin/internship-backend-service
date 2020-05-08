import crypto from 'crypto';
import userModel from '../models/userModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export async function registerUser(req, res, next) {
  const user = await userModel.create(req.body);
  sendTokenResponse(user, 200, res);
}

/**
 * Login a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export async function loginUser(req, res, next) {
  const {
    email,
    password
  } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter password and email', 400));
  }

  // get user
  const user = await userModel.findOne({
    email
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
}

/**
 * Get current logged in user
 * @route   GET /api/v1/auth/current
 * @access  Private
 */
export async function getCurrentUser(req, res, next) {
  const user = req.user;
  res.status(200)
    .json({
      success: true,
      user
    });
}

/**
 * Forgot password
 * @route   GET /api/v1/auth/forgotpassword
 * @access  Public
 */
export async function forgotPassword(req, res, next) {
  const user = await userModel.findOne({
    email: req.body.email
  });

  if (!user) {
    return next(new ErrorResponse('No such email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false
  });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this because a request to reset the password was sent to the user with the email ${user.email}. To reset the password please make a PUT request to:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });

    res.status(200)
      .json({
        success: true,
        data: 'Email sent'
      });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false
    });

    return next(new ErrorResponse('Reset token email cannot be sent', 500));
  }
}


/**
 * Reset Password
 * @route   GET /api/v1/auth/resetPassword/:resettoken
 * @access  Public
 */
export async function resetPassword(req, res, next) {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
}

/**
 * Send authentication response that includes the token and a secure cookie.
 * @param {*} user the user that's being authenticated
 * @param {*} statusCode http status code of the response
 * @param {*} res the response to the http request
 */
function sendTokenResponse(user, statusCode, res) {
  // create token
  const token = user.getSignedJwtToken();

  const expireDelta = process.env.JWT_COOKIE_EXPIRE * 86400000; // 86400000 = 1000[milliseconds] * 60[seconds] * 60[minutes] * 24[hours]

  const options = {
    expires: new Date(Date.now() + expireDelta),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}