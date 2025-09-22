import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}

/**
 * Validation rules for user signup
 */
export const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validation rules for creating a report
 */
export const validateCreateReport = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('location')
    .isObject()
    .withMessage('Location must be a valid GeoJSON object'),
  
  body('location.type')
    .equals('Point')
    .withMessage('Location type must be "Point"'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array with exactly 2 elements'),
  
  body('location.coordinates.*')
    .isNumeric()
    .withMessage('Coordinates must be numeric'),
  
  body('location.coordinates.0')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('location.coordinates.1')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  handleValidationErrors
];

/**
 * Validation rules for updating a report
 */
export const validateUpdateReport = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('status')
    .optional()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Status must be one of: Open, In Progress, Resolved, Closed'),
  
  handleValidationErrors
];

/**
 * Validation rules for MongoDB ObjectId parameters
 */
export const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

/**
 * Validation rules for UUID parameters (PostgreSQL)
 */
export const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

/**
 * Dynamic validation for ID parameters based on database type
 */
export const validateId = process.env.DATABASE_TYPE === 'mongodb' ? validateMongoId : validateUUID;

/**
 * Validation rules for query parameters in report listing
 */
export const validateReportQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'upvoteCount', 'title'])
    .withMessage('SortBy must be one of: createdAt, updatedAt, upvoteCount, title'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either "asc" or "desc"'),
  
  query('status')
    .optional()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Status must be one of: Open, In Progress, Resolved, Closed'),
  
  handleValidationErrors
];

/**
 * Validation rules for file uploads
 */
export function validateFileUpload(req, res, next) {
  if (!req.file) {
    return next(); // File is optional
  }

  const file = req.file;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG and PNG images are allowed.'
    });
  }

  // Check file size
  if (file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB.'
    });
  }

  next();
}