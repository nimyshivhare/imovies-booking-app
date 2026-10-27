const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide theatre address/location'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    totalHalls: {
      type: Number,
      default: 4,
    },
    phone: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
