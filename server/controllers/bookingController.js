const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Show = require('../models/Show');
const Payment = require('../models/Payment');

// Helper to calculate total price based on seat tiers
const calculateSeatPrice = (basePrice, seatType) => {
  if (seatType === 'VIP') return Math.round(basePrice * 1.3);
  if (seatType === 'PREMIUM') return Math.round(basePrice * 1.15);
  return basePrice;
};

// @desc    Create new booking and mock payment
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, seatNumbers, paymentMethod } = req.body;

    if (!showId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: 'showId and an array of seatNumbers are required' });
    }

    const show = await Show.findById(showId).populate('movieId theatreId');
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if any requested seats are already booked
    const requestedSeats = await Seat.find({
      showId,
      seatNumber: { $in: seatNumbers },
    });

    if (requestedSeats.length !== seatNumbers.length) {
      return res.status(400).json({ message: 'One or more selected seats do not exist for this show' });
    }

    const alreadyBookedSeats = requestedSeats.filter((s) => s.isBooked);
    if (alreadyBookedSeats.length > 0) {
      const bookedList = alreadyBookedSeats.map((s) => s.seatNumber).join(', ');
      return res.status(400).json({
        message: `Seats already booked by another user: ${bookedList}. Please choose different seats.`,
      });
    }

    // Calculate total price with seat tiers
    let totalAmount = 0;
    requestedSeats.forEach((seat) => {
      totalAmount += calculateSeatPrice(show.ticketPrice, seat.seatType);
    });

    // Create Booking
    const booking = new Booking({
      userId: req.user._id,
      showId,
      seatsReserved: seatNumbers,
      totalAmount,
      bookingStatus: 'CONFIRMED',
    });

    const savedBooking = await booking.save();

    // Create Payment Record
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const payment = await Payment.create({
      bookingId: savedBooking._id,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'COMPLETED',
      transactionId,
    });

    savedBooking.paymentId = payment._id;
    await savedBooking.save();

    // Mark seats as booked
    await Seat.updateMany(
      { showId, seatNumber: { $in: seatNumbers } },
      { $set: { isBooked: true, bookedBy: req.user._id } }
    );

    // Socket.io Real-time update
    const io = req.app.get('socketio');
    if (io) {
      io.to(`show_${showId}`).emit('seatsUpdated', {
        showId,
        bookedSeats: seatNumbers,
        action: 'booked',
      });
    }

    const fullBooking = await Booking.findById(savedBooking._id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration language genre' },
          { path: 'theatreId', select: 'name location city' },
        ],
      })
      .populate('userId', 'name email')
      .populate('paymentId');

    res.status(201).json(fullBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership or admin
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Mark booking as cancelled
    booking.bookingStatus = 'CANCELLED';
    await booking.save();

    // Release seats
    await Seat.updateMany(
      { showId: booking.showId, seatNumber: { $in: booking.seatsReserved } },
      { $set: { isBooked: false, bookedBy: null } }
    );

    // Update payment record to REFUNDED
    if (booking.paymentId) {
      await Payment.findByIdAndUpdate(booking.paymentId, {
        paymentStatus: 'REFUNDED',
      });
    }

    // Emit real-time seat update via Socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.to(`show_${booking.showId}`).emit('seatsUpdated', {
        showId: booking.showId,
        releasedSeats: booking.seatsReserved,
        action: 'released',
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled and seats released successfully. Refund initiated.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's booking history
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration language genre' },
          { path: 'theatreId', select: 'name location city' },
        ],
      })
      .populate('paymentId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration language genre' },
          { path: 'theatreId', select: 'name location city' },
        ],
      })
      .populate('userId', 'name email')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID (For E-Ticket / Confirmation)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration language genre rating' },
          { path: 'theatreId', select: 'name location city totalHalls' },
        ],
      })
      .populate('userId', 'name email')
      .populate('paymentId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Must be owner or admin
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
};
