const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    seatNumber: {
      type: String, // e.g. "A1", "A2", "B5"
      required: true,
    },
    row: {
      type: String, // e.g. "A", "B", "C"
      required: true,
    },
    seatType: {
      type: String,
      enum: ['STANDARD', 'PREMIUM', 'VIP'],
      default: 'STANDARD',
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique seat per show
seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
