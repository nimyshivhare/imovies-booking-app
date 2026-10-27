const express = require('express');
const router = express.Router();
const {
  createBooking,
  cancelBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, adminOnly, getAllBookings);

router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
