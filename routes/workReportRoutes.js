import express from 'express';
import {
  createWorkReport,
  getWorkReports,
  updateWorkReport,
  deleteWorkReport,
  getMonthlyReports,
  getEditWorkReportForm 
} from '../controllers/workReportController.js';

import { authMiddleware } from '../middleware/authmiddleware.js';
import { validate } from '../validators/validate.js';
import {
  createWorkReportSchema,
  updateWorkReportSchema,
} from '../validators/workReportValidator.js';

import WorkReport from '../models/workReportModel.js';
import User from '../models/userModel.js';

const router = express.Router();


router.get('/edit/:id', authMiddleware, getEditWorkReportForm);


router.post(
  '/edit/:id',
  authMiddleware,
  validate(updateWorkReportSchema),
  updateWorkReport
);


router.get('/createWorkReport', authMiddleware, async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const users = await User.find().select('name _id');

    const filter = {};
    if (req.user.role === 'admin') {
      if (userId) filter.createdBy = userId;
    } else {
      filter.createdBy = req.user.userId;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
      };
    }

    const workReports = await WorkReport.find(filter)
      .populate('createdBy')
      .sort({ date: -1 });

    res.render('workreport', {
      success: req.query.success,
      error: req.query.error,
      user: req.user,
      workReports,
      users,
      selectedUser: userId || '',
      startDate: startDate || '',
      endDate: endDate || '',
    });
  } catch (err) {
    res.render('workreport', {
      success: false,
      error: 'Failed to load work reports',
      user: req.user,
      workReports: [],
      users: [],
      selectedUser: '',
      startDate: '',
      endDate: '',
    });
  }
});


router.post(
  '/createWorkReport',
  authMiddleware,
  validate(createWorkReportSchema),
  createWorkReport
);


router.get('/getWorkReports', authMiddleware, getWorkReports);

//
router.put(
  '/updateWorkReport/:id',
  authMiddleware,
  validate(updateWorkReportSchema),
  updateWorkReport
);


router.delete('/deleteWorkReport/:id', authMiddleware, deleteWorkReport);


router.get('/getMonthlyReports/:year/:month', authMiddleware, getMonthlyReports);

export default router;
