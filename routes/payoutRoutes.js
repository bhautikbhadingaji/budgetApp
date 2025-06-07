import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getPayoutByDateRange } from '../controllers/payoutController.js';

const router = express.Router();

router.post('/date-range',getPayoutByDateRange);

export default router;
