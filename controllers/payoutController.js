import WorkReport from '../models/workReportModel.js';

export const getPayoutByDateRange = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    
    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: "userId, startDate and endDate are required" });
    }

    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59); 

    
    const reports = await WorkReport.find({
      createdBy: userId,
      date: { $gte: start, $lte: end }
    }).populate('createdBy', 'name perHourCharge'); 

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found for the given date range" });
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

    
    res.status(200).json({
      userId,
      username,
      perHourCharge,
      startDate,
      endDate,
      totalWorkedTime: {
        hours: totalHours,
        minutes: totalMinutes,
      },
      // totalHrs: Number(totalHrs.toFixed(2)), 
      totalPayment: Number(totalPayment.toFixed(2)) 
    });
  } catch (error) {
    console.error("Payout Controller Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
