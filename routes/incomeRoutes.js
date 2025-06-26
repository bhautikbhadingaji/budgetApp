import express from 'express';
import {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome
} from '../controllers/incomeController.js';
import { authMiddleware, restrictUserRoutes } from '../middleware/authmiddleware.js';
import { validate } from '../validators/validate.js';
import { incomeSchema } from '../validators/incomeValidator.js';

const router = express.Router();

router.get('/add-income', authMiddleware, getIncomes);


router.post('/add-income', authMiddleware, validate(incomeSchema), addIncome);


router.get('/get-incomes', authMiddleware, getIncomes);

router.put('/update-income/:id', authMiddleware, validate(incomeSchema), updateIncome);


router.delete('/delete-income/:id', authMiddleware, deleteIncome);

export default router;
