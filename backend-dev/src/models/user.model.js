import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'vendor'],
    required: true
  },
  companyName: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.models.USER || mongoose.model('User', userSchema);
