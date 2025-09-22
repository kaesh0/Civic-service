import express from 'express';
import multer from 'multer';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  toggleUpvote
} from '../controllers/reportController.js';
import {
  validateCreateReport,
  validateUpdateReport,
  validateId,
  validateReportQuery,
  validateFileUpload
} from '../middleware/validation.js';
import { authenticateToken, requireOwnership } from '../middleware/auth.js';
import { requireS3Config } from '../services/s3Service.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * @route   GET /api/v1/reports
 * @desc    Get all reports with pagination and filtering
 * @access  Public
 */
router.get('/', validateReportQuery, getReports);

/**
 * @route   POST /api/v1/reports
 * @desc    Create a new report
 * @access  Private
 */
router.post('/', 
  authenticateToken,
  requireS3Config,
  upload.single('photo'),
  validateFileUpload,
  validateCreateReport,
  createReport
);

/**
 * @route   GET /api/v1/reports/:id
 * @desc    Get a single report by ID
 * @access  Public
 */
router.get('/:id', validateId, getReportById);

/**
 * @route   PATCH /api/v1/reports/:id
 * @desc    Update a report (owner only)
 * @access  Private
 */
router.patch('/:id', 
  authenticateToken,
  validateId,
  requireOwnership(),
  validateUpdateReport,
  updateReport
);

/**
 * @route   DELETE /api/v1/reports/:id
 * @desc    Delete a report (owner only)
 * @access  Private
 */
router.delete('/:id',
  authenticateToken,
  validateId,
  requireOwnership(),
  deleteReport
);

/**
 * @route   POST /api/v1/reports/:id/upvote
 * @desc    Toggle upvote on a report
 * @access  Private
 */
router.post('/:id/upvote',
  authenticateToken,
  validateId,
  toggleUpvote
);

export default router;