import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import userModel from '../models/userModel.js';

// protect routes
export default async function protect(req, res, next) {
  let token;
  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.userId = await userModel.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
}