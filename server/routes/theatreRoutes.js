const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require('../controllers/theatreController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTheatres)
  .post(protect, adminOnly, createTheatre);

router.route('/:id')
  .get(getTheatreById)
  .put(protect, adminOnly, updateTheatre)
  .delete(protect, adminOnly, deleteTheatre);

module.exports = router;
