import { getUserModel } from '../models/index.js';
import authService from '../services/authService.js';
import { formatUserResponse, createApiResponse, logApiRequest } from '../utils/helpers.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const signup = asyncHandler(async (req, res) => {
  logApiRequest(req, 'User Signup');
  
  const { username, email, password } = req.body;
  const User = getUserModel();

  // Check if user already exists
  let existingUser;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
  } else {
    existingUser = await User.findOne({
      where: {
        [User.sequelize.Sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });
  }

  if (existingUser) {
    const field = existingUser.email === email ? 'email' : 'username';
    throw new AppError(`User with this ${field} already exists`, HTTP_STATUS.CONFLICT);
  }

  // Create new user
  const userData = { username, email, password };
  let newUser;

  if (process.env.DATABASE_TYPE === 'mongodb') {
    newUser = new User(userData);
    await newUser.save();
  } else {
    newUser = await User.create(userData);
  }

  // Generate tokens
  const userId = newUser.id || newUser._id;
  const tokens = authService.generateTokens(userId);

  // Set refresh token cookie
  authService.setRefreshTokenCookie(res, tokens.refreshToken);

  // Format response
  const userResponse = formatUserResponse(newUser);
  const responseData = {
    user: userResponse,
    accessToken: tokens.accessToken
  };

  res.status(HTTP_STATUS.CREATED).json(
    createApiResponse(true, SUCCESS_MESSAGES.USER_CREATED, responseData)
  );
});

/**
 * Authenticate user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = asyncHandler(async (req, res) => {
  logApiRequest(req, 'User Login');
  
  const { email, password } = req.body;
  const User = getUserModel();

  // Find user with password field included
  let user;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    user = await User.findOne({ email }).select('+password');
  } else {
    user = await User.scope('withPassword').findOne({ where: { email } });
  }

  if (!user) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  // Generate tokens
  const userId = user.id || user._id;
  const tokens = authService.generateTokens(userId);

  // Set refresh token cookie
  authService.setRefreshTokenCookie(res, tokens.refreshToken);

  // Format response
  const userResponse = formatUserResponse(user);
  const responseData = {
    user: userResponse,
    accessToken: tokens.accessToken
  };

  res.status(HTTP_STATUS.OK).json(
    createApiResponse(true, SUCCESS_MESSAGES.LOGIN_SUCCESS, responseData)
  );
});

/**
 * Refresh access token using refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refresh = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Token Refresh');
  
  const userId = req.user.id || req.user._id;
  
  // Generate new access token
  const accessToken = authService.generateAccessToken(userId);
  
  const responseData = { accessToken };
  
  res.status(HTTP_STATUS.OK).json(
    createApiResponse(true, SUCCESS_MESSAGES.TOKEN_REFRESHED, responseData)
  );
});

/**
 * Logout user and clear refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logout = asyncHandler(async (req, res) => {
  logApiRequest(req, 'User Logout');
  
  // Clear refresh token cookie
  authService.clearRefreshTokenCookie(res);
  
  res.status(HTTP_STATUS.NO_CONTENT).json(
    createApiResponse(true, SUCCESS_MESSAGES.LOGOUT_SUCCESS)
  );
});

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProfile = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Get Profile');
  
  const userResponse = formatUserResponse(req.user);
  
  res.status(HTTP_STATUS.OK).json(
    createApiResponse(true, 'Profile retrieved successfully', { user: userResponse })
  );
});