import express from 'express';
import { authMiddleware, restrictUserRoutes } from '../middleware/authmiddleware.js';
import { getPayoutByDateRange } from '../controllers/payoutController.js';
import { validate } from '../validators/validate.js';
import { payoutSchema } from '../validators/payoutValidator.js';
import User from '../models/userModel.js';
import { payoutToExpense } from '../controllers/payoutController.js';


const router = express.Router();
router.get('/date-range', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'name _id');
    res.render('payout', {
      users,
      result: null,
      error: null,
      success: null, 
      user: req.user
    });
  } catch (error) {
    res.status(500).send('Error loading form');
  }
});






router.post('/mark-paid', authMiddleware, payoutToExpense);

router.post('/date-range',getPayoutByDateRange);

export default router;
