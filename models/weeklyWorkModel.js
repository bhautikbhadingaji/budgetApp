import mongoose from 'mongoose';

const weeklyWorkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  assignedHours: { type: Number, required: true },
  workedHours: { type: String },
  remainingHours: { type: String },
  extraHours: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WeeklyWork', weeklyWorkSchema);
