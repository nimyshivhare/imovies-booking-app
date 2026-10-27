const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide movie title'],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
    },
    language: {
      type: String,
      required: [true, 'Please provide movie language'],
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide movie duration in minutes'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide poster URL or image path'],
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 8.5,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide release date'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
