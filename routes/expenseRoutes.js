import express from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';

import { authMiddleware } from '../middleware/authmiddleware.js';
import { validate } from '../validators/validate.js';
import { expenseSchema } from '../validators/expenseValidator.js';
import Expense from '../models/expenseModel.js';

const router = express.Router();

router.get('/add-expenses', authMiddleware, async (req, res) => {
  try {
    let expenses;

    if (req.user.role === 'admin') {
      expenses = await Expense.find()
        .sort({ date: -1 })
        .populate({ path: 'userId', select: 'name', options: { strictPopulate: false } })
        .populate({ path: 'createdBy', select: 'name', options: { strictPopulate: false } });
    } else {
      expenses = await Expense.find({ userId: req.user.userId })
        .sort({ date: -1 })
        .populate({ path: 'userId', select: 'name', options: { strictPopulate: false } })
        .populate({ path: 'createdBy', select: 'name', options: { strictPopulate: false } });
    }

    console.log("Expenses loaded for:", req.user.username);
    expenses.forEach((exp, i) => {
      console.log(`Expense #${i + 1}`, {
        name: exp.name,
        userId: exp.userId?.name,
        createdBy: exp.createdBy?.name
      });
    });

    res.render('expense', {
      success: req.query.success,
      error: req.query.error,
      user: req.user,
      expenses
    });
  } catch (err) {
    console.error(err);
    res.redirect('/expenses/add-expenses?error=Failed to load expenses');
  }
});

router.post('/add-expenses', authMiddleware, validate(expenseSchema), addExpense);
router.get('/get-expenses', authMiddleware, getExpenses);
router.put('/update-expense/:id', authMiddleware, updateExpense);
router.delete('/delete-expense/:id', authMiddleware, deleteExpense);

export default router;
