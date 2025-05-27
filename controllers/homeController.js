import Income from '../models/incomeModel.js';
import Expense from '../models/expenseModel.js';

export const getHomeSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const incomes = await Income.find({ userId });
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    const expenses = await Expense.find({ userId });
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({ totalIncome, totalExpense, balance });
  } catch (error) {
    console.error('Home Summary Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
