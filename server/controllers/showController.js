const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Theatre = require('../models/Theatre');
const { generateSeatsForShow } = require('../utils/seatGenerator');

// @desc    Get shows with filters (movieId, theatreId, date, city)
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date, city } = req.query;
    const filter = {};

    if (movieId) {
      filter.movieId = movieId;
    }

    if (theatreId) {
      filter.theatreId = theatreId;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.showTime = { $gte: startOfDay, $lte: endOfDay };
    }

    let query = Show.find(filter)
      .populate('movieId', 'title genre language duration posterUrl releaseDate')
      .populate('theatreId', 'name location city totalHalls')
      .sort({ showTime: 1 });

    const shows = await query;

    // Filter by theatre city if city parameter is supplied
    if (city && city !== 'All') {
      const filtered = shows.filter(
        (show) => show.theatreId && show.theatreId.city.toLowerCase() === city.toLowerCase()
      );
      return res.json(filtered);
    }

    res.json(shows);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title genre language duration posterUrl description rating releaseDate')
      .populate('theatreId', 'name location city totalHalls');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  } catch (error) {
    next(error);
  }
};

// @desc    Create show and generate seats automatically
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const { movieId, theatreId, showTime, ticketPrice, hallNumber } = req.body;

    if (!movieId || !theatreId || !showTime || ticketPrice === undefined) {
      return res.status(400).json({ message: 'movieId, theatreId, showTime, and ticketPrice are required' });
    }

    const show = await Show.create({
      movieId,
      theatreId,
      showTime: new Date(showTime),
      ticketPrice: Number(ticketPrice),
      hallNumber: hallNumber ? Number(hallNumber) : 1,
    });

    // Automatically generate 60 cinema seats for this show
    await generateSeatsForShow(show._id);

    const populatedShow = await Show.findById(show._id)
      .populate('movieId', 'title posterUrl')
      .populate('theatreId', 'name location city');

    res.status(201).json(populatedShow);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show and associated seats
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    await Seat.deleteMany({ showId: show._id });
    await Show.findByIdAndDelete(req.params.id);

    res.json({ message: 'Show and associated seats deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
  deleteShow,
};
