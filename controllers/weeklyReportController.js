import WorkReport from '../models/workReportModel.js';
import User from '../models/userModel.js';
import moment from 'moment';

export const renderWeeklyReport = async (req, res) => {
  try {
    const users = await User.find().select('name _id');
    const selectedUserId = req.query.userId || '';
    const selectedMonth = req.query.month || '';
    const selectedWeek = req.query.week || '';

    let reports = [];
    let totalHours = 0;
    let totalMinutes = 0;

    if (selectedUserId && selectedMonth && selectedWeek) {
      const year = new Date().getFullYear();
      const firstDayOfMonth = moment(`${year}-${parseInt(selectedMonth) + 1}-01`);
      const weekStart = firstDayOfMonth.clone().add((selectedWeek - 1) * 7, 'days');
      const weekEnd = weekStart.clone().add(6, 'days');

      const filter = {
        createdBy: selectedUserId,
        date: {
          $gte: weekStart.startOf('day').toDate(),
          $lte: weekEnd.endOf('day').toDate()
        }
      };

      reports = await WorkReport.find(filter)
        .populate('createdBy', 'name')
        .sort({ date: -1 });

     
      reports.forEach(report => {
        totalHours += report.hoursWorked.hours;
        totalMinutes += report.hoursWorked.minutes;
      });

      
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
    }

    res.render('weekly-report', {
      user: req.user,
      users,
      selectedUser: selectedUserId,
      selectedUserId,
      selectedMonth,
      selectedWeek,
      reports,
      totalHours,
      totalMinutes,
      error: null
    });
  } catch (err) {
    console.error('Weekly Report Error:', err);
    res.render('weekly-report', {
      user: req.user,
      users: [],
      selectedUser: '',
      selectedUserId: '',
      selectedMonth: '',
      selectedWeek: '',
      reports: [],
      totalHours: 0,
      totalMinutes: 0,
      error: 'Failed to load weekly reports.'
    });
  }
};
