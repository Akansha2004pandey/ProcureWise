import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  items: [{
    type: String,
    required: true
  }],
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export const RFP = mongoose.models.RFP || mongoose.model('RFP', rfpSchema);
