import User from '../models/userModel.js';
import WorkReport from '../models/workReportModel.js';
import WeeklyWork from '../models/weeklyWorkModel.js';
import moment from 'moment';

export const renderWeeklyEntry = async (req, res) => {
  try {
    const users = await User.find({}, 'name _id');
    const entries = await WeeklyWork.find().populate('user createdBy').sort({ startDate: -1 }); 

    res.render('weeklyWorkForm', {
      users,
      result: null,
      error: null,
      user: req.user,
      entries,
      prevRemaining: null
    });
  } catch (err) {
    console.error('Render Weekly Entry Error:', err);
    res.render('weeklyWorkForm', {
      users: [],
      result: null,
      error: 'Failed to load users',
      user: req.user,
      entries: [],
      prevRemaining: null
    });
  }
};

export const submitWeeklyEntry = async (req, res) => {
  const { userId, startDate, endDate, assignedHours, assignedMinutes } = req.body;

  try {
    const user = await User.findById(userId);

    const reports = await WorkReport.find({
      createdBy: userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59))
      }
    });

    let totalHours = 0, totalMinutes = 0;
    reports.forEach(r => {
      totalHours += r.hoursWorked.hours;
      totalMinutes += r.hoursWorked.minutes;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    const workedTotalMinutes = totalHours * 60 + totalMinutes;

    const assgHr = parseInt(assignedHours) || 0;
    const assgMin = parseInt(assignedMinutes) || 0;
    let assignedTotalMinutes = assgHr * 60 + assgMin;

    const lastEntry = await WeeklyWork.findOne({ user: userId }).sort({ endDate: -1 });
    let prevRemainingMinutes = 0;
    let prevRemaining = null;

    if (lastEntry && lastEntry.remainingHours !== '0') {
      const match = lastEntry.remainingHours.match(/(\d+)\s*hr\s*(\d+)\s*min/);
      if (match) {
        const hr = parseInt(match[1]);
        const min = parseInt(match[2]);
        prevRemainingMinutes = hr * 60 + min;
        prevRemaining = `${hr} hr ${min} min`;
      }
    }

    assignedTotalMinutes += prevRemainingMinutes;

    let remainingMinutes = assignedTotalMinutes - workedTotalMinutes;
    let extraMinutes = workedTotalMinutes - assignedTotalMinutes;

    const assignedFinalHr = Math.floor(assignedTotalMinutes / 60);
    const assignedFinalMin = assignedTotalMinutes % 60;

    const remainingHours = remainingMinutes > 0 ? Math.floor(remainingMinutes / 60) : 0;
    const remainingMins = remainingMinutes > 0 ? remainingMinutes % 60 : 0;

    const extraHours = extraMinutes > 0 ? Math.floor(extraMinutes / 60) : 0;
    const extraMins = extraMinutes > 0 ? extraMinutes % 60 : 0;

    const result = {
      username: user.name,
      startDate,
      endDate,
      assigned: `${assignedFinalHr} hr ${assignedFinalMin} min`,
      worked: `${totalHours} hr ${totalMinutes} min`,
      remaining: remainingMinutes > 0 ? `${remainingHours} hr ${remainingMins} min` : '0',
      extra: extraMinutes > 0 ? `${extraHours} hr ${extraMins} min` : '0'
    };

    const newWeeklyWork = new WeeklyWork({
      user: userId,
      startDate,
      endDate,
      assignedHours: result.assigned,
      workedHours: result.worked,
      remainingHours: result.remaining,
      extraHours: result.extra,
      createdBy: req.user.userId
    });

    await newWeeklyWork.save();

    const users = await User.find({}, 'name _id');
    const entries = await WeeklyWork.find().populate('user createdBy').sort({ startDate: -1 }); 

    res.render('weeklyWorkForm', {
      users,
      result,
      error: null,
      user: req.user,
      entries,
      prevRemaining
    });

  } catch (err) {
    console.error('Weekly Entry Error:', err);
    const users = await User.find({}, 'name _id');
    res.render('weeklyWorkForm', {
      users,
      result: null,
      error: 'Failed to fetch data',
      user: req.user,
      entries: [],
      prevRemaining: null
    });
  }
};

export const filterWeeklyEntry = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const users = await User.find({}, 'name _id');
    const filter = {};

    if (userId) {
      filter.user = userId;
    }

    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
      };
    } else if (startDate) {
      filter.startDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.startDate = { $lte: new Date(new Date(endDate).setHours(23, 59, 59)) };
    }

    const entries = await WeeklyWork.find(filter).populate('user createdBy').sort({ startDate: -1 });

    res.render('weeklyWorkForm', {
      users,
      result: null,
      error: null,
      user: req.user,
      entries,
      prevRemaining: null
    });

  } catch (err) {
    console.error('Filter Weekly Entry Error:', err);
    const users = await User.find({}, 'name _id');
    res.render('weeklyWorkForm', {
      users,
      result: null,
      error: 'Failed to filter data',
      user: req.user,
      entries: [],
      prevRemaining: null
    });
  }
};
