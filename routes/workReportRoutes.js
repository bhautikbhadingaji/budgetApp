import express from 'express';
import {
  createWorkReport,
  getWorkReports,
  updateWorkReport,
  deleteWorkReport,
} from '../controllers/workReportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

import { getMonthlyReports } from '../controllers/workReportController.js';
// import { getSummaryByDateRange } from '../controllers/workReportController.js';
import { validate } from '../validators/validate.js';
import { createWorkReportSchema, updateWorkReportSchema } from '../validators/workReportValidator.js';


const router = express.Router();

router.get('/createWorkReport', authMiddleware, (req, res) => {
  console.log(req.user);
  res.render('workreport', {
    success: req.query.success,
    error: req.query.error, user: req.user
  });
});



router.post('/createWorkReport', authMiddleware, validate(createWorkReportSchema), createWorkReport);


router.get('/getWorkReports', authMiddleware, getWorkReports);
router.put('/updateWorkReport/:id', validate(updateWorkReportSchema), authMiddleware, updateWorkReport);
router.delete('/deleteWorkReport/:id', authMiddleware, deleteWorkReport);
router.get('/getMonthlyReports/:year/:month', authMiddleware, getMonthlyReports);

// monthlly
// router.post('/summary', authMiddleware, getSummaryByDateRange);

export default router;









router.get('/monthlyReports/:year/:month', authMiddleware, getMonthlyReports);





