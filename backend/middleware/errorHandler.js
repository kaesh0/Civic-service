/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    message: 'Internal server error'
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    error.message = 'Validation failed';
    error.errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json(error);
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    error.message = `${field} already exists`;
    return res.status(409).json(error);
  }

  if (err.name === 'SequelizeValidationError') {
    // Sequelize validation error
    error.message = 'Validation failed';
    error.errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json(error);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    // Sequelize unique constraint error
    const field = err.errors[0]?.path || 'field';
    error.message = `${field} already exists`;
    return res.status(409).json(error);
  }

  if (err.name === 'CastError') {
    // MongoDB invalid ObjectId
    error.message = 'Invalid ID format';
    return res.status(400).json(error);
  }

  if (err.name === 'JsonWebTokenError') {
    // JWT error
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    // JWT expired
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  if (err.name === 'MulterError') {
    // File upload error
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'File size too large';
      return res.status(400).json(error);
    }
    error.message = 'File upload error';
    return res.status(400).json(error);
  }

  // Handle custom errors with status codes
  if (err.statusCode) {
    error.message = err.message;
    return res.status(err.statusCode).json(error);
  }

  // Development vs Production error responses
  if (process.env.NODE_ENV === 'development') {
    error.message = err.message;
    error.stack = err.stack;
  }

  // Default 500 error
  res.status(500).json(error);
}

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async error wrapper to catch async errors in route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}