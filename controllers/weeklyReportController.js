import WorkReport from '../models/workReportModel.js';
import User from '../models/userModel.js';
import WeeklyWork from '../models/weeklyWorkModel.js'; 
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
    let assignedHours = 0;

    if (selectedUserId && selectedMonth && selectedWeek) {
      const year = new Date().getFullYear();
      const monthStart = moment(`${year}-${parseInt(selectedMonth) + 1}-01`);
      const targetWeek = parseInt(selectedWeek);

      const firstWeekOfMonth = monthStart.isoWeek();
      const isoWeekNumber = firstWeekOfMonth + targetWeek - 1;

      const weekStart = moment().year(year).isoWeek(isoWeekNumber).startOf('isoWeek');
      const weekEnd = moment().year(year).isoWeek(isoWeekNumber).endOf('isoWeek');

      const filter = {
        createdBy: selectedUserId,
        date: {
          $gte: weekStart.toDate(),
          $lte: weekEnd.toDate()
        }
      };

      reports = await WorkReport.find(filter)
        .populate('createdBy', 'name')
        .sort({ date: 1 });

      reports.forEach(report => {
        totalHours += report.hoursWorked.hours;
        totalMinutes += report.hoursWorked.minutes;
      });

      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;

      
      const assignedEntry = await WeeklyWork.findOne({
        user: selectedUserId,
        startDate: { $gte: weekStart.toDate(), $lte: weekEnd.toDate() }
      });

      if (assignedEntry) {
        assignedHours = assignedEntry.assignedHours || 0;
      }
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
      assignedHours, 
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
      assignedHours: 0,
      error: 'Failed to load weekly reports.'
    });
  }
};
