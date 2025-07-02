import express from 'express';
import {
  renderWeeklyEntry,
  submitWeeklyEntry,
  filterWeeklyEntry
} from '../controllers/weeklyWorkController.js';

import { authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();


router.get('/weekly-work', authMiddleware, renderWeeklyEntry);


router.post('/weekly-work', authMiddleware, submitWeeklyEntry);


router.get('/weekly-work/filter', authMiddleware, filterWeeklyEntry);

export default router;
