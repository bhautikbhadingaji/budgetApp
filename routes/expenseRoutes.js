import express from 'express';


import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validate.js';
import { expenseSchema } from '../validators/expenseValidator.js';


const router = express.Router();


router.get('/add-expenses',authMiddleware, (req, res) => {
  res.render('expense', {success: req.query.success, error: req.query.error, user: req.user }); 
});


router.post('/add-expenses', authMiddleware, validate(expenseSchema), addExpense);


router.get('/get-expenses', authMiddleware, getExpenses);
router.put('/update-expense/:id', authMiddleware, updateExpense);
router.delete('/delete-expense/:id', authMiddleware, deleteExpense);

export default router;


