/**
 * Application constants and enums
 */

export const REPORT_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
};

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

export const SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  UPVOTE_COUNT: 'upvoteCount',
  TITLE: 'title'
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  REPORT_NOT_FOUND: 'Report not found',
  ALREADY_UPVOTED: 'You have already upvoted this report',
  OWNER_ONLY: 'You can only modify your own reports',
  FILE_UPLOAD_ERROR: 'File upload failed',
  S3_NOT_CONFIGURED: 'File upload service is not configured'
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User account created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  REPORT_CREATED: 'Report created successfully',
  REPORT_UPDATED: 'Report updated successfully',
  REPORT_DELETED: 'Report deleted successfully',
  UPVOTE_ADDED: 'Report upvoted successfully',
  UPVOTE_REMOVED: 'Upvote removed successfully'
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000
  },
  COORDINATES: {
    LONGITUDE: { MIN: -180, MAX: 180 },
    LATITUDE: { MIN: -90, MAX: 90 }
  }
};

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'civic-reporter-api',
  AUDIENCE: 'civic-reporter-client'
};

export const COOKIE_CONFIG = {
  REFRESH_TOKEN: {
    NAME: 'refreshToken',
    MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
    HTTP_ONLY: true,
    SAME_SITE: 'strict'
  }
};