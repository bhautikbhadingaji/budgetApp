import express from 'express';
import {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome
} from '../controllers/incomeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../validators/validate.js';
import { incomeSchema } from '../validators/incomeValidators.js';


const router = express.Router();

router.get('/add-income',  validate(incomeSchema),authMiddleware,authMiddleware, addIncome, (req, res) => {
  res.render('income'); 
});


router.post('/add-income',  validate(incomeSchema),authMiddleware,authMiddleware, addIncome);
router.get('/get-incomes', authMiddleware, getIncomes);
router.put('/update-income/:id',  validate(incomeSchema), authMiddleware, updateIncome);
router.delete('/delete-income/:id', authMiddleware, deleteIncome);

export default router;
