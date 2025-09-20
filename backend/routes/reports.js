import express from 'express';
import {
  createReport,
  editReport,
  vouchReport,
  getReports,
  getReportById
} from '../controllers/reportController.js';
import {
  validateReport,
  validateReportEdit,
  validateReportId
} from '../middleware/validation.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /reports/create
router.post('/create', authenticateToken, validateReport, createReport);

// PUT /reports/edit/:id
router.put('/edit/:id', authenticateToken, validateReportEdit, editReport);

// POST /reports/vouch/:id
router.post('/vouch/:id', authenticateToken, validateReportId, vouchReport);

// GET /reports/list
router.get('/list', optionalAuth, getReports);

// GET /reports/:id
router.get('/:id', optionalAuth, validateReportId, getReportById);

export default router;