import Expense from '../models/expenseModel.js';
import User from '../models/userModel.js';
export const addExpense = async (req, res) => {
  try {
    const { amount, date, category } = req.body;

    if (!req.user || !req.user.userId) {
      return res.redirect(`/expenses/add-expenses?error=${encodeURIComponent("Unauthorized: user info missing")}`);
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.redirect(`/expenses/add-expenses?error=${encodeURIComponent("User not found")}`);
    }

    const expense = new Expense({
      name: user.name,
      amount,
      date,
      category,
      userId: req.user.userId,        
      createdBy: req.user.userId       
    });

    await expense.save();

    res.redirect("/expenses/add-expenses?success=Expense added successfully");
  } catch (err) {
    console.error('Expense Error:', err.message);

    let errorMessage = 'Something went wrong';
    if (err.errors && Array.isArray(err.errors)) {
      errorMessage = err.errors[0];
    } else if (err.message) {
      errorMessage = err.message;
    }

    res.redirect(`/expenses/add-expenses?error=${encodeURIComponent(errorMessage)}`);
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.redirect('/login');
    }

  const expenses = await Expense.find({ userId })
  .populate({ path: 'createdBy', select: 'name', options: { strictPopulate: false } })
  .populate({ path: 'userId', select: 'name', options: { strictPopulate: false } });


    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('expense', {
      expenses,
      success,
      error,
      user: req.user
    });
  } catch (err) {
    console.error('Get Expenses Error:', err);
    res.render('expense', {
      expenses: [],
      success: null,
      error: 'Server error',
      user: req.user
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, date, category } = req.body;

    const updated = await Expense.findByIdAndUpdate(
      id,
      { name, amount, date, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense updated successfully', updated });
  } catch (err) {
    console.error('Update Expense Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete Expense Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};