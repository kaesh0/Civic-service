import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /auth/signup
router.post('/signup', validateSignup, signup);

// POST /auth/login
router.post('/login', validateLogin, login);

// GET /auth/profile
router.get('/profile', authenticateToken, getProfile);

export default router;