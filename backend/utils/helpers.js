import { DEFAULT_PAGINATION, SORT_ORDER } from './constants.js';

/**
 * Sanitize and validate pagination parameters
 * @param {Object} query - Query parameters from request
 * @returns {Object} Sanitized pagination object
 */
export function sanitizePagination(query) {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGINATION.PAGE);
  const limit = Math.min(
    DEFAULT_PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || DEFAULT_PAGINATION.LIMIT)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Sanitize sort parameters
 * @param {Object} query - Query parameters from request
 * @returns {Object} Sanitized sort object
 */
export function sanitizeSort(query) {
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? SORT_ORDER.ASC : SORT_ORDER.DESC;
  
  return { sortBy, sortOrder };
}

/**
 * Build MongoDB sort object
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Object} MongoDB sort object
 */
export function buildMongoSort(sortBy, sortOrder) {
  return { [sortBy]: sortOrder === SORT_ORDER.ASC ? 1 : -1 };
}

/**
 * Build Sequelize order array
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} Sequelize order array
 */
export function buildSequelizeOrder(sortBy, sortOrder) {
  return [[sortBy, sortOrder.toUpperCase()]];
}

/**
 * Format user object for API response (remove sensitive data)
 * @param {Object} user - User object
 * @returns {Object} Formatted user object
 */
export function formatUserResponse(user) {
  if (process.env.DATABASE_TYPE === 'mongodb') {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, __v, ...safeUser } = userObj;
    return safeUser;
  } else {
    // PostgreSQL/Sequelize
    const userObj = user.toJSON ? user.toJSON() : user;
    const { password, ...safeUser } = userObj;
    return safeUser;
  }
}

/**
 * Format report object for API response
 * @param {Object} report - Report object
 * @returns {Object} Formatted report object
 */
export function formatReportResponse(report) {
  if (process.env.DATABASE_TYPE === 'mongodb') {
    const reportObj = report.toObject ? report.toObject() : report;
    return reportObj;
  } else {
    // PostgreSQL/Sequelize - convert location to GeoJSON format
    const reportObj = report.toJSON ? report.toJSON() : report;
    
    if (reportObj.location && reportObj.location.coordinates) {
      reportObj.location = {
        type: 'Point',
        coordinates: reportObj.location.coordinates
      };
    }
    
    return reportObj;
  }
}

/**
 * Build pagination metadata for API response
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination metadata
 */
export function buildPaginationMeta(page, limit, total) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
}

/**
 * Generate a random string for various purposes
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate GeoJSON Point coordinates
 * @param {Object} location - GeoJSON location object
 * @returns {boolean} True if valid
 */
export function isValidGeoJSONPoint(location) {
  return (
    location &&
    location.type === 'Point' &&
    Array.isArray(location.coordinates) &&
    location.coordinates.length === 2 &&
    typeof location.coordinates[0] === 'number' &&
    typeof location.coordinates[1] === 'number' &&
    location.coordinates[0] >= -180 &&
    location.coordinates[0] <= 180 &&
    location.coordinates[1] >= -90 &&
    location.coordinates[1] <= 90
  );
}

/**
 * Convert coordinates for PostgreSQL POINT format
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {Object} PostgreSQL POINT object
 */
export function coordinatesToPostgresPoint(coordinates) {
  return {
    type: 'Point',
    coordinates: coordinates
  };
}

/**
 * Extract coordinates from PostgreSQL POINT
 * @param {Object} point - PostgreSQL POINT object
 * @returns {Array} [longitude, latitude]
 */
export function postgresPointToCoordinates(point) {
  if (point && point.coordinates) {
    return point.coordinates;
  }
  return null;
}

/**
 * Create a standardized API response
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {Object} data - Response data
 * @param {Object} meta - Additional metadata
 * @returns {Object} Standardized response object
 */
export function createApiResponse(success, message, data = null, meta = null) {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
}

/**
 * Log API request for debugging
 * @param {Object} req - Express request object
 * @param {string} action - Action being performed
 */
export function logApiRequest(req, action) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${action}`);
    if (req.user) {
      console.log(`User: ${req.user.id || req.user._id} (${req.user.email})`);
    }
  }
}