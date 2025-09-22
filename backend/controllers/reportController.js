import { getReportModel, getUpvoteModel, getUserModel } from '../models/index.js';
import s3Service from '../services/s3Service.js';
import { 
  formatReportResponse, 
  createApiResponse, 
  logApiRequest,
  sanitizePagination,
  sanitizeSort,
  buildMongoSort,
  buildSequelizeOrder,
  buildPaginationMeta,
  coordinatesToPostgresPoint
} from '../utils/helpers.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create a new report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createReport = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Create Report');
  
  const { title, description, location } = req.body;
  const userId = req.user.id || req.user._id;
  const Report = getReportModel();

  // Handle photo upload if present
  let photoUrl = null;
  if (req.file) {
    photoUrl = await s3Service.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'reports'
    );
  }

  // Prepare report data
  const reportData = {
    title,
    description,
    location,
    photoUrl,
    status: 'Open',
    upvoteCount: 0
  };

  // Create report based on database type
  let newReport;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    reportData.author = userId;
    newReport = new Report(reportData);
    await newReport.save();
    
    // Populate author information
    await newReport.populate('author', 'username email');
  } else {
    // PostgreSQL
    reportData.authorId = userId;
    reportData.location = coordinatesToPostgresPoint(location.coordinates);
    
    newReport = await Report.create(reportData);
    
    // Include author information
    const User = getUserModel();
    newReport = await Report.findByPk(newReport.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email']
      }]
    });
  }

  const reportResponse = formatReportResponse(newReport);
  
  res.status(HTTP_STATUS.CREATED).json(
    createApiResponse(true, SUCCESS_MESSAGES.REPORT_CREATED, { report: reportResponse })
  );
});

/**
 * Get all reports with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getReports = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Get Reports');
  
  const Report = getReportModel();
  const User = getUserModel();
  const { page, limit, skip } = sanitizePagination(req.query);
  const { sortBy, sortOrder } = sanitizeSort(req.query);
  const { status } = req.query;

  let reports, total;

  if (process.env.DATABASE_TYPE === 'mongodb') {
    // Build filter
    const filter = {};
    if (status) filter.status = status;

    // Get total count
    total = await Report.countDocuments(filter);

    // Get reports with pagination
    const sort = buildMongoSort(sortBy, sortOrder);
    reports = await Report.find(filter)
      .populate('author', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  } else {
    // PostgreSQL
    const where = {};
    if (status) where.status = status;

    const order = buildSequelizeOrder(sortBy, sortOrder);

    // Get reports with pagination
    const result = await Report.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email']
      }],
      order,
      limit,
      offset: skip
    });

    reports = result.rows;
    total = result.count;
  }

  // Format reports
  const formattedReports = reports.map(formatReportResponse);
  
  // Build pagination metadata
  const pagination = buildPaginationMeta(page, limit, total);

  res.status(HTTP_STATUS.OK).json(
    createApiResponse(
      true, 
      'Reports retrieved successfully', 
      { reports: formattedReports },
      { pagination }
    )
  );
});

/**
 * Get a single report by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getReportById = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Get Report by ID');
  
  const { id } = req.params;
  const Report = getReportModel();
  const User = getUserModel();

  let report;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    report = await Report.findById(id).populate('author', 'username email');
  } else {
    report = await Report.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email']
      }]
    });
  }

  if (!report) {
    throw new AppError(ERROR_MESSAGES.REPORT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const reportResponse = formatReportResponse(report);
  
  res.status(HTTP_STATUS.OK).json(
    createApiResponse(true, 'Report retrieved successfully', { report: reportResponse })
  );
});

/**
 * Update a report (owner only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateReport = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Update Report');
  
  const { title, description, status } = req.body;
  const report = req.resource; // Set by requireOwnership middleware
  const Report = getReportModel();
  const User = getUserModel();

  // Update fields
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;

  let updatedReport;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    Object.assign(report, updates);
    updatedReport = await report.save();
    await updatedReport.populate('author', 'username email');
  } else {
    await report.update(updates);
    updatedReport = await Report.findByPk(report.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email']
      }]
    });
  }

  const reportResponse = formatReportResponse(updatedReport);
  
  res.status(HTTP_STATUS.OK).json(
    createApiResponse(true, SUCCESS_MESSAGES.REPORT_UPDATED, { report: reportResponse })
  );
});

/**
 * Delete a report (owner only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteReport = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Delete Report');
  
  const report = req.resource; // Set by requireOwnership middleware

  // Delete photo from S3 if exists
  if (report.photoUrl) {
    try {
      await s3Service.deleteFile(report.photoUrl);
    } catch (error) {
      console.error('Failed to delete photo from S3:', error);
      // Continue with report deletion even if S3 deletion fails
    }
  }

  // Delete report
  if (process.env.DATABASE_TYPE === 'mongodb') {
    await report.deleteOne();
  } else {
    await report.destroy();
  }

  res.status(HTTP_STATUS.NO_CONTENT).json(
    createApiResponse(true, SUCCESS_MESSAGES.REPORT_DELETED)
  );
});

/**
 * Toggle upvote on a report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const toggleUpvote = asyncHandler(async (req, res) => {
  logApiRequest(req, 'Toggle Upvote');
  
  const { id: reportId } = req.params;
  const userId = req.user.id || req.user._id;
  const Report = getReportModel();
  const Upvote = getUpvoteModel();
  const User = getUserModel();

  // Check if report exists
  let report;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    report = await Report.findById(reportId);
  } else {
    report = await Report.findByPk(reportId);
  }

  if (!report) {
    throw new AppError(ERROR_MESSAGES.REPORT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Check if user already upvoted
  let existingUpvote;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    existingUpvote = await Upvote.findOne({ user: userId, report: reportId });
  } else {
    existingUpvote = await Upvote.findOne({
      where: { userId, reportId }
    });
  }

  let message;
  if (existingUpvote) {
    // Remove upvote
    if (process.env.DATABASE_TYPE === 'mongodb') {
      await existingUpvote.deleteOne();
      await Report.findByIdAndUpdate(reportId, { $inc: { upvoteCount: -1 } });
    } else {
      await existingUpvote.destroy();
      await report.decrement('upvoteCount');
    }
    message = SUCCESS_MESSAGES.UPVOTE_REMOVED;
  } else {
    // Add upvote
    if (process.env.DATABASE_TYPE === 'mongodb') {
      await Upvote.create({ user: userId, report: reportId });
      await Report.findByIdAndUpdate(reportId, { $inc: { upvoteCount: 1 } });
    } else {
      await Upvote.create({ userId, reportId });
      await report.increment('upvoteCount');
    }
    message = SUCCESS_MESSAGES.UPVOTE_ADDED;
  }

  // Get updated report
  let updatedReport;
  if (process.env.DATABASE_TYPE === 'mongodb') {
    updatedReport = await Report.findById(reportId).populate('author', 'username email');
  } else {
    updatedReport = await Report.findByPk(reportId, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email']
      }]
    });
  }

  const reportResponse = formatReportResponse(updatedReport);
  
  res.status(HTTP_STATUS.OK).json(
    createApiResponse(true, message, { report: reportResponse })
  );
});