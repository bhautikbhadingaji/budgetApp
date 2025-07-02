import mongoose from 'mongoose';

const weeklyReportSummarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  assignedHours: {
    type: Number,
    required: true,
  },
  workedHours: {
    type: Number,
    required: true,
  },
  remainingHours: {
    type: Number,
    required: true,
  },
  extraHours: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('WeeklyReportSummary', weeklyReportSummarySchema);
