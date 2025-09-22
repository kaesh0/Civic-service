import express from 'express';
import { signup, login, refresh, logout, getProfile } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
import { authenticateToken, authenticateRefreshToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validateSignup, signup);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get tokens
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Private (requires refresh token)
 */
router.post('/refresh', authenticateRefreshToken, refresh);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and clear refresh token
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

export default router;