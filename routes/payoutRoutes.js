import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getPayoutByDateRange } from '../controllers/payoutController.js';
import { validate } from '../validators/validate.js';
import { payoutSchema } from '../validators/payoutValidators.js';

const router = express.Router();

router.post('/date-range',  validate(payoutSchema),getPayoutByDateRange);

export default router;
