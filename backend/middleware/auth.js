import jwt from 'jsonwebtoken';
import { getUserModel } from '../models/index.js';

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const User = getUserModel();
    let user;

    if (process.env.DATABASE_TYPE === 'mongodb') {
      user = await User.findById(decoded.userId);
    } else {
      user = await User.findByPk(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Middleware to authenticate refresh tokens from cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export async function authenticateRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user from database
    const User = getUserModel();
    let user;

    if (process.env.DATABASE_TYPE === 'mongodb') {
      user = await User.findById(decoded.userId);
    } else {
      user = await User.findByPk(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token - user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token expired'
      });
    }

    console.error('Refresh token middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Middleware to check if the authenticated user owns the resource
 * @param {string} resourceIdParam - The parameter name containing the resource ID
 * @param {string} ownerField - The field name that contains the owner ID
 * @returns {Function} Express middleware function
 */
export function requireOwnership(resourceIdParam = 'id', ownerField = 'author') {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id || req.user._id;

      // Get the resource to check ownership
      const { getReportModel } = await import('../models/index.js');
      const Report = getReportModel();
      
      let resource;
      if (process.env.DATABASE_TYPE === 'mongodb') {
        resource = await Report.findById(resourceId);
        if (!resource) {
          return res.status(404).json({
            success: false,
            message: 'Resource not found'
          });
        }
        
        // Check ownership
        const ownerId = resource[ownerField]?.toString();
        if (ownerId !== userId.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Access denied - you can only modify your own resources'
          });
        }
      } else {
        resource = await Report.findByPk(resourceId);
        if (!resource) {
          return res.status(404).json({
            success: false,
            message: 'Resource not found'
          });
        }
        
        // Check ownership (for PostgreSQL, the field is authorId)
        const ownerFieldName = ownerField === 'author' ? 'authorId' : ownerField;
        if (resource[ownerFieldName] !== userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied - you can only modify your own resources'
          });
        }
      }

      // Add resource to request for use in controller
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}