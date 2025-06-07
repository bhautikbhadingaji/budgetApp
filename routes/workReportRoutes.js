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


const router = express.Router();

router.post('/createWorkReport', authMiddleware, createWorkReport);
router.get('/getWorkReports', authMiddleware, getWorkReports);
router.put('/updateWorkReport/:id', authMiddleware, updateWorkReport);
router.delete('/deleteWorkReport/:id', authMiddleware, deleteWorkReport);
router.get('/getMonthlyReports/:year/:month', authMiddleware, getMonthlyReports);

// monthlly
// router.post('/summary', authMiddleware, getSummaryByDateRange);

export default router;









router.get('/monthlyReports/:year/:month', authMiddleware, getMonthlyReports);





