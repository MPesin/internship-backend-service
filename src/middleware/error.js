import ErrorResponse from '../utils/ErrorResponse.js';

/** Middleware for handaling errors */
export default function errorHandler(err, req, res, next) {
  // making a copy of err using the spread operator, for the error object to send in the response (res)
  let error = {
    message: err.message,
    ...err
  };
  console.log(`${err.stack}`.red);

  // handle mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resourse of id ${err.value} doesn\'t exist`;
    error = new ErrorResponse(message, 404);
  }

  // handle mongoose double id
  if (err.code === 11000) {
    const message = `Duplicate id entered, this id already exists`;
    error = new ErrorResponse(message, 404);
  }

  // handle mangoose validation error
  if (err.name === 'ValidationError') {
    console.log(err.errors);

    const message = Object.values(err.errors).map(err => err.message);
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Unknown Server Error'
  });
}