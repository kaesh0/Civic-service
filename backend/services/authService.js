import jwt from 'jsonwebtoken';

/**
 * Authentication service for JWT token management
 */
class AuthService {
  /**
   * Generate access token
   * @param {string} userId - User ID
   * @returns {string} JWT access token
   */
  generateAccessToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
        issuer: 'civic-reporter-api',
        audience: 'civic-reporter-client'
      }
    );
  }

  /**
   * Generate refresh token
   * @param {string} userId - User ID
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { 
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
        issuer: 'civic-reporter-api',
        audience: 'civic-reporter-client'
      }
    );
  }

  /**
   * Generate both access and refresh tokens
   * @param {string} userId - User ID
   * @returns {Object} Object containing both tokens
   */
  generateTokens(userId) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId)
    };
  }

  /**
   * Verify access token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'civic-reporter-api',
      audience: 'civic-reporter-client'
    });
  }

  /**
   * Verify refresh token
   * @param {string} token - JWT refresh token to verify
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'civic-reporter-api',
      audience: 'civic-reporter-client'
    });
  }

  /**
   * Set refresh token cookie
   * @param {Object} res - Express response object
   * @param {string} refreshToken - Refresh token to set
   */
  setRefreshTokenCookie(res, refreshToken) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/'
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
  }

  /**
   * Clear refresh token cookie
   * @param {Object} res - Express response object
   */
  clearRefreshTokenCookie(res) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} Extracted token or null
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Get token expiration time in seconds
   * @param {string} token - JWT token
   * @returns {number} Expiration timestamp
   */
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} True if token is expired
   */
  isTokenExpired(token) {
    const exp = this.getTokenExpiration(token);
    if (!exp) return true;
    
    return Date.now() >= exp * 1000;
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;