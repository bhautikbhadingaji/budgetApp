
import Income from '../models/incomeModel.js';


export const addIncome = async (req, res) => {
  try {
    console.log("req.user", req.user);
    console.log("Request Body", req.body);

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

    console.log("Income", income);
    await income.save();

  
   res.redirect("/income/add-income?success=true");

  } catch (err) {
  console.error('Income Error:', err.message);

  let errorMessage = 'Something went wrong';


  if (err.errors && Array.isArray(err.errors)) {
    errorMessage = err.errors[0];
  } else if (err.message) {
    errorMessage = err.message;
  }

 
  res.redirect(`/income/add-income?error=${encodeURIComponent(errorMessage)}`);
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
