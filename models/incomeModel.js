
import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  amount: Number,
  date: String,
  category: String
});

const Income = mongoose.model('Income', incomeSchema);

export default Income;
