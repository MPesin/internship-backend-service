import userModel from '../models/userModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export async function registerUser(req, res, next) {

  const user = await userModel.create(req.body);

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
}

/**
 * Register a new user
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

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
}