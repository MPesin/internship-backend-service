import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import userModel from '../models/userModel.js';

/**
 * protects the route from unautherized request.
 */
export async function protect(req, res, next) {
  let token;
  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
}

/**
 * Grant access to specific roles to access route.
 * @param  {...any} roles list of authorized roles
 */
export function authorize(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`The role of user '${req.user.fullName}' is '${req.user.role}', this role is not authorized to access this route`, 403));
    }
    next();
  }
}