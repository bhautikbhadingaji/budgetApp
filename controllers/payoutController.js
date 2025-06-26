// payoutController.js
import WorkReport from '../models/workReportModel.js';
import User from '../models/userModel.js';
import Expense from '../models/expenseModel.js';

export const getPayoutByDateRange = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    if (!userId || !startDate || !endDate) {
      return res.render('payoutResult', { error: 'All fields are required', result: null });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const reports = await WorkReport.find({
      createdBy: userId,
      date: { $gte: start, $lte: end }
    }).populate('createdBy', 'name perHourCharge');

    if (reports.length === 0) {
      return res.render('payoutResult', { error: 'No data found for selected range.', result: null });
    }

    let totalHours = 0;
    let totalMinutes = 0;

    for (const report of reports) {
      totalHours += report.hoursWorked?.hours || 0;
      totalMinutes += report.hoursWorked?.minutes || 0;
    }

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    const username = reports[0].createdBy?.name || "Unknown";
    const perHourCharge = reports[0].createdBy?.perHourCharge || 0;
    const totalHrs = totalHours + totalMinutes / 60;
    const totalPayment = totalHrs * perHourCharge;

    const status = reports.every(r => r.status === 'Paid') ? 'Paid' : 'Unpaid';

    res.render('payout', {
      user: req.user,
      users: await User.find({}, 'name _id'),
      success: null,
      error: null,
      result: {
        userId,
        username,
        startDate,
        endDate,
        perHourCharge,
        totalHours,
        totalMinutes,
        totalPayment: totalPayment.toFixed(2),
        status
      }
    });
  } catch (error) {
    console.error("Payout Controller Error:", error);
    res.render('payoutResult', { error: "Server Error", result: null });
  }
};

export const payoutToExpense = async (req, res) => {
  try {
    const { userId, startDate, endDate, totalPayment } = req.body;

    if (!userId || !totalPayment) {
      return res.redirect('/payout/date-range?error=Missing data');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.redirect('/payout/date-range?error=User not found');
    }

    const expense = new Expense({
      name: user.name,
      amount: parseFloat(totalPayment),
      date: new Date(),
      category: 'Selery',
      userId
    });

    await expense.save();

    await WorkReport.updateMany({
      createdBy: userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59))
      }
    }, { $set: { status: 'Paid' } });

    res.redirect('/payout/date-range?success=Marked as paid and added to expenses');
  } catch (err) {
    console.error('Click to Pay Error:', err);
    res.redirect('/payout/date-range?error=Something went wrong');
  }
};
