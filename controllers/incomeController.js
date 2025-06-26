import Income from '../models/incomeModel.js';

export const addIncome = async (req, res) => {
  try {
    const { name, amount, date, category } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: user info missing" });
    }

    const income = new Income({
      name,
      amount,
      date,
      category,
      userId: req.user.userId
    });

    await income.save();
    res.redirect("/income/add-income?success=true");

  } catch (err) {
    console.error('Income Error:', err.message);
    let errorMessage = err.message || 'Something went wrong';
    res.redirect(`/income/add-income?error=${encodeURIComponent(errorMessage)}`);
  }
};

export const getIncomes = async (req, res) => {
  try {
    let incomes;

    if (req.user.role === 'admin') {
      incomes = await Income.find().sort({ date: -1 }).populate('userId', 'name').lean();
    } else {
      incomes = await Income.find({ userId: req.user.userId }).sort({ date: -1 }).populate('userId', 'name').lean();
    }

    res.render("income", {
      incomes,
      success: req.query.success || null,
      error: req.query.error || null,
      user: req.user
    });
  } catch (err) {
    console.error('Get Incomes Error:', err);
    res.render("income", {
      incomes: [],
      success: null,
      error: 'Server error while fetching incomes',
      user: req.user
    });
  }
};



export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, date, category } = req.body;

    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { name, amount, date, category },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income updated successfully', updatedIncome });
  } catch (err) {
    console.error('Update Income Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error('Delete Income Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
