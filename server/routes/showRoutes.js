const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShows)
  .post(protect, adminOnly, createShow);

router.route('/:id')
  .get(getShowById)
  .delete(protect, adminOnly, deleteShow);

module.exports = router;
