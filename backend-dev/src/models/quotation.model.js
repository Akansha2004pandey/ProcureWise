import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  rfpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFP',
    required: true
  },
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryTime: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Quotation = mongoose.models. Quotation || mongoose.model('Quotation', quotationSchema);
