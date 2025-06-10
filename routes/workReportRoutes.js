import express from 'express';
import {
  createWorkReport,
  getWorkReports,
  updateWorkReport,
  deleteWorkReport,
} from '../controllers/workReportController.js';
import { authMiddleware } from '../middleware/auth.js';


import {getMonthlyReports} from '../controllers/workReportController.js';
// import { getSummaryByDateRange } from '../controllers/workReportController.js';
import { validate } from '../validators/validate.js';
import { createWorkReportSchema, updateWorkReportSchema } from '../validators/workReportValidators.js';


const router = express.Router();

router.post('/createWorkReport', validate(createWorkReportSchema), authMiddleware, createWorkReport);
router.get('/getWorkReports', authMiddleware, getWorkReports);
router.put('/updateWorkReport/:id', validate(updateWorkReportSchema), authMiddleware, updateWorkReport);
router.delete('/deleteWorkReport/:id', authMiddleware, deleteWorkReport);
router.get('/getMonthlyReports/:year/:month', authMiddleware, getMonthlyReports);

// monthlly
// router.post('/summary', authMiddleware, getSummaryByDateRange);

export default router;









router.get('/monthlyReports/:year/:month', authMiddleware, getMonthlyReports);





