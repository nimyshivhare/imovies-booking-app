const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please specify the movie'],
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Please specify the theatre'],
    },
    showTime: {
      type: Date,
      required: [true, 'Please specify the show date and time'],
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Please specify the ticket price'],
      min: 0,
    },
    hallNumber: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Show', showSchema);
