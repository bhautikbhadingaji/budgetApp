import express from 'express';

import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';

import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/add-expense', authMiddleware, addExpense);
router.get('/get-expenses', authMiddleware, getExpenses);
router.put('/update-expense/:id', authMiddleware, updateExpense);
router.delete('/delete-expense/:id', authMiddleware, deleteExpense);

export default router;


