import { name } from 'ejs';
import mongoose from 'mongoose';

const workReportSchema = new mongoose.Schema(
  {
     username: {
    type: String,
    
  },
    date: {
      type: Date,
      required: true,
    },
    hoursWorked: {
      hours: {
        type: Number,
        required: true,
      },
      minutes: {
        type: Number,
        required: true,
      }
    },
    description: {
      type: String,
      required: true,
    },
    status: {
  type: String,
  enum: ['Paid', 'Unpaid'],
  default: 'Unpaid'
},

    // perHourCharge: {
    //   type: Number,
    //   required: true,
    // },
    // totalPayment: {
    //   type: Number,
    //   required: true,
    // },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true

  
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  
  { timestamps: true }
);

export default mongoose.model('WorkReport', workReportSchema);
