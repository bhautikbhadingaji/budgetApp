
import Income from '../models/incomeModel.js';

export const addIncome = async (req, res) => {
  try {
    const { name, amount, date, category } = req.body;
  console.log("Decoded JWT user:", req.user); //........


    const income = new Income({
      name,
      amount,
      date,
      category,
      userId: req.user.userId
    });

    await income.save();
    res.status(201).json({ message: 'Income added successfully', income });
  } catch (err) {
    console.error('Add Income Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getIncomes = async (req, res) => {
  try {
    const userId = req.user._id; 
    const incomes = await Income.find({ userId });
    res.status(200).json(incomes);
  } catch (err) {
    console.error('Get Incomes Error:', err);
    res.status(500).json({ message: 'Server error' });
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
