import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected','cancelled'], default: 'pending' },
  leaveType: { type: String, enum: ['half', 'full'], required: true },
  reason: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('LeaveApplication', leaveSchema);
