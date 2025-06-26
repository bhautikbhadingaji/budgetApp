import WorkReport from '../models/workReportModel.js';
import User from '../models/userModel.js';

export const createWorkReport = async (req, res) => {
  try {
    const username = req.user.username;
    const { hoursWorked, description, perHourCharge, date } = req.body;

    const entryTime = date ? new Date(date) : new Date();

    const hrs = Number(hoursWorked?.hours || 0);
    const mins = Number(hoursWorked?.minutes || 0);
    const rate = Number(perHourCharge || 0);

    const totalHours = hrs + mins / 60;
    const totalPayment = totalHours * rate;

    if (isNaN(totalPayment)) {
      return res.redirect(`/workreports/createWorkReport?error=${encodeURIComponent("Invalid input: check hours or rate")}`);
    }

    const report = new WorkReport({
      date: entryTime,
      username,
      hoursWorked: { hours: hrs, minutes: mins },
      description,
      perHourCharge: rate,
      totalPayment,
      createdBy: req.user.userId,
    });

    await report.save();

    return res.redirect("/workreports/createWorkReport?success=true");

  } catch (error) {
    console.error('Create Work Report Error:', error);

    let errorMessage = 'Something went wrong';
    if (error.message) {
      errorMessage = error.message;
    }

    return res.redirect(`/workreports/createWorkReport?error=${encodeURIComponent(errorMessage)}`);
  }
};

export const getWorkReports = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const filter = {};

    if (req.user.role === 'admin') {
      if (userId) {
        filter.createdBy = userId;
      }
    } else {
      filter.createdBy = req.user.userId;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59))
      };
    }

    const reports = await WorkReport.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    const users = await User.find().select('name _id');

    res.render('workReport', {
      user: req.user,
      users,
      workReports: reports,
      success: req.query.success,
      error: req.query.error,
      selectedUser: userId || '',
      startDate: startDate || '',
      endDate: endDate || ''
    });
  } catch (error) {
    console.error('Get Work Reports Error:', error);
    res.status(500).send('Error fetching reports');
  }
};

export const getEditWorkReportForm = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await WorkReport.findById(id);

    if (!report) {
      return res.redirect('/workreports/createWorkReport?error=Work report not found');
    }

    if (req.user.role !== 'admin' && report.createdBy.toString() !== req.user.userId) {
      return res.redirect('/workreports/createWorkReport?error=Unauthorized');
    }

    res.render('editWorkReport', {
      report,
      user: req.user
    });
  } catch (error) {
    console.error('Edit Work Report Error:', error);
    res.redirect('/workreports/createWorkReport?error=Failed to load report');
  }
};

export const updateWorkReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { hoursWorked, description, perHourCharge, date } = req.body;

    const existing = await WorkReport.findById(id);
    if (!existing) {
      return res.status(404).send('Work report not found');
    }

    const hrs = Number(hoursWorked?.hours ?? existing.hoursWorked.hours);
    const mins = Number(hoursWorked?.minutes ?? existing.hoursWorked.minutes);
    const rate = typeof perHourCharge !== 'undefined'
      ? Number(perHourCharge)
      : existing.perHourCharge;

    const totalHours = hrs + mins / 60;
    const totalPayment = totalHours * rate;

    existing.hoursWorked = { hours: hrs, minutes: mins };
    existing.description = description ?? existing.description;
    existing.perHourCharge = rate;
    existing.totalPayment = totalPayment;
    existing.updatedBy = req.user.userId;
    existing.updatedAt = new Date();

    if (date) {
      existing.date = new Date(date);
    }

    await existing.save();

    return res.redirect('/workreports/createWorkReport?success=Report updated successfully');
  } catch (error) {
    console.error('Error updating work report:', error);
    return res.redirect(`/workreports/createWorkReport?error=${encodeURIComponent(error.message)}`);
  }
};

export const deleteWorkReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await WorkReport.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Work report not found' });
    }

    if (req.user.role !== 'admin' && report.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'No permission' });
    }

    await report.deleteOne();
    return res.status(200).json({ message: 'Work report deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMonthlyReports = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.userId;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const reports = await WorkReport.find({
      createdBy: userId,
      date: { $gte: start, $lte: end }
    });

    let totalHours = 0;
    let totalMinutes = 0;
    let totalPayment = 0;
    const workedDays = new Set();

    for (const report of reports) {
      totalHours += report.hoursWorked?.hours || 0;
      totalMinutes += report.hoursWorked?.minutes || 0;
      totalPayment += report.totalPayment || 0;

      const dateKey = new Date(report.date).toISOString().split('T')[0];
      workedDays.add(dateKey);
    }

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    const actualWorkedHours = totalHours + totalMinutes / 60;

    const daysInMonth = new Date(year, month, 0).getDate();
    const totalRequiredHours = daysInMonth * 8;
    const shortage = Math.max(0, totalRequiredHours - actualWorkedHours);

    const shortageHours = Math.floor(shortage);
    const shortageMinutes = Math.round((shortage - shortageHours) * 60);
    const missingDays = daysInMonth - workedDays.size;

    res.status(200).json({
      userId,
      year,
      month,
      totalHours,
      totalMinutes,
      totalWorkedHours: {
        hours: Math.floor(actualWorkedHours),
        minutes: Math.round((actualWorkedHours - Math.floor(actualWorkedHours)) * 60)
      },
      totalPayment,
      totalRequiredHours,
      shortage: {
        hours: shortageHours,
        minutes: shortageMinutes
      },
      missingDays
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

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
    }).populate('createdBy', 'name');

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found for given date range" });
    }

    let totalHours = 0;
    let totalMinutes = 0;
    let totalPayment = 0;

    for (const report of reports) {
      totalHours += report.hoursWorked?.hours || 0;
      totalMinutes += report.hoursWorked?.minutes || 0;
      totalPayment += report.totalPayment || 0;
    }

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    const username = reports[0].createdBy?.name || "Unknown";
    const perHourCharge = reports[0].perHourCharge || 0;

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
      totalPayment,
    });
  } catch (error) {
    console.error("Payout Controller Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// monthlly

// export const getSummaryByDateRange = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.body;
//     const userId = req.user.userId;

//     if (!startDate || !endDate) {
//       return res.status(400).json({ message: 'Start date and end date required' });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59); 

//     const reports = await WorkReport.find({
//       createdBy: userId,
//       date: { $gte: start, $lte: end }
//     });

//     let totalHours = 0;
//     let totalMinutes = 0;
//     let totalPayment = 0;

//     for (const report of reports) {
//       const hrs = report.hoursWorked.hours;
//       const mins = report.hoursWorked.minutes;
//       totalHours += hrs;
//       totalMinutes += mins;
//       totalPayment += report.totalPayment;
//     }

    
//     totalHours += Math.floor(totalMinutes / 60);
//     totalMinutes = totalMinutes % 60;

//     return res.status(200).json({
//       userId,
//       from: startDate,
//       to: endDate,
//       totalWorked: {
//         hours: totalHours,
//         minutes: totalMinutes,
//       },
//       totalPayment,
//     });
//   } catch (error) {
//     console.error('Summary Error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


//  "totalPayment": 21166.666666666668