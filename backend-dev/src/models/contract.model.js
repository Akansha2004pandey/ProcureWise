import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  rfpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFP'
  },
  text: {
    type: String,
    required: true
  },
  riskFlags: [{
    type: String
  }],
  insights: [{
    type: String
  }],
  auditedAt: {
    type: Date,
    default: Date.now
  }
});

export const Contract =mongoose.models.Contract ||  mongoose.model('Contract', contractSchema);
