const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/')
  .get(getMovies)
  .post(protect, adminOnly, createMovie);

// Poster image upload route for admin
router.post('/upload', protect, adminOnly, upload.single('poster'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
});

router.route('/:id')
  .get(getMovieById)
  .put(protect, adminOnly, updateMovie)
  .delete(protect, adminOnly, deleteMovie);

module.exports = router;
