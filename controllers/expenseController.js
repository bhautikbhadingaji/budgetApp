import Expense from '../models/expenseModel.js';

export const addExpense = async (req, res) => {
  try {
    const { name, amount, date, category } = req.body;

    if (!req.user || !req.user.userId) {
      return res.redirect(`/expenses/add-expenses?error=${encodeURIComponent("Unauthorized: user info missing")}`);
    }

    const expense = new Expense({
      name,
      amount,
      date,
      category,
      userId: req.user.userId
    });

    await expense.save();

    res.redirect("/expenses/add-expenses?success=true");

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
      return res.status(400).json({ message: 'User ID is required' });
    }

    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Get Expenses Error:', err);
    res.status(500).json({ message: 'Server error' });
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
