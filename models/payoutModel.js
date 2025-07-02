import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  startDate: Date,
  endDate: Date,
  amount: Number,
  status: { type: String, default: 'Unpaid' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Payout', payoutSchema);
