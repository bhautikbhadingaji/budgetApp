import express from 'express';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { renderWeeklyReport } from '../controllers/weeklyReportController.js';

const router = express.Router();

router.get('/weekly-report', authMiddleware, renderWeeklyReport);

export default router;
