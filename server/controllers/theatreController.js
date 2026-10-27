const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');

// @desc    Get all theatres (with optional city filter)
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const filter = {};
    if (city && city !== 'All') {
      filter.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const theatres = await Theatre.find(filter).sort({ name: 1 });
    res.json(theatres);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }
    res.json(theatre);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const { name, location, city, totalHalls, phone } = req.body;

    const theatre = await Theatre.create({
      name,
      location,
      city,
      totalHalls: totalHalls ? Number(totalHalls) : 4,
      phone: phone || '',
    });

    res.status(201).json(theatre);
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    const { name, location, city, totalHalls, phone } = req.body;
    theatre.name = name ?? theatre.name;
    theatre.location = location ?? theatre.location;
    theatre.city = city ?? theatre.city;
    theatre.totalHalls = totalHalls !== undefined ? Number(totalHalls) : theatre.totalHalls;
    theatre.phone = phone ?? theatre.phone;

    const updated = await theatre.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre and associated shows & seats
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    const shows = await Show.find({ theatreId: theatre._id });
    const showIds = shows.map((s) => s._id);

    await Seat.deleteMany({ showId: { $in: showIds } });
    await Show.deleteMany({ theatreId: theatre._id });
    await Theatre.findByIdAndDelete(req.params.id);

    res.json({ message: 'Theatre and related shows deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
};
