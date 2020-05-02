import userModel from '../models/userModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export async function registerUser(req, res, next) {
  const user = await userModel.create(req.body);
  sendResponse(user, 200, res);
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

  sendResponse(user, 200, res);
}

/**
 * Send authentication response that includes the token and a secure cookie.
 * @param {*} user the user that's being authenticated
 * @param {*} statusCode http status code of the response
 * @param {*} res the response
 */
function sendResponse(user, statusCode, res) {
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