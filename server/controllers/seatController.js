const Seat = require('../models/Seat');

// @desc    Get all seats for a given show
// @route   GET /api/seats/show/:showId
// @access  Public
const getSeatsByShowId = async (req, res, next) => {
  try {
    const { showId } = req.params;

    const seats = await Seat.find({ showId }).sort({ row: 1, seatNumber: 1 });

    if (!seats || seats.length === 0) {
      return res.status(404).json({ message: 'No seats found for this show' });
    }

    res.json(seats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSeatsByShowId,
};
