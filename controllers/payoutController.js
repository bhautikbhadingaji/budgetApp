import WorkReport from '../models/workReportModel.js';
import User from '../models/userModel.js';

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

   res.render('payout', {
      user: req.user, 
  users: await User.find({}, 'name _id'), 
  error: null,
  result: {
    username,
    startDate,
    endDate,
    perHourCharge,
    totalHours,
    totalMinutes,
    totalPayment: totalPayment.toFixed(2)
  }
});
  } catch (error) {
    console.error("Payout Controller Error:", error);
    res.render('payoutResult', { error: "Server Error", result: null });
  }
};