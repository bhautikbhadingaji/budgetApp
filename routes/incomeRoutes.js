import express from 'express';
import {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome
} from '../controllers/incomeController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();


router.post('/add-income', authMiddleware, addIncome);
router.get('/get-incomes', authMiddleware, getIncomes);
router.put('/update-income/:id', authMiddleware, updateIncome);
router.delete('/delete-income/:id', authMiddleware, deleteIncome);

export default router;
