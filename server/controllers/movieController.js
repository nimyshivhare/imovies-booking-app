const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Seat = require('../models/Seat');

// @desc    Fetch all movies with optional search & filter
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    if (genre && genre !== 'All') {
      filter.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (language && language !== 'All') {
      filter.language = { $regex: `^${language}$`, $options: 'i' };
    }

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const { title, genre, language, duration, posterUrl, bannerUrl, description, rating, releaseDate } = req.body;

    const formattedGenre = Array.isArray(genre)
      ? genre
      : typeof genre === 'string'
      ? genre.split(',').map((g) => g.trim())
      : [];

    const movie = new Movie({
      title,
      genre: formattedGenre,
      language,
      duration: Number(duration),
      posterUrl,
      bannerUrl: bannerUrl || '',
      description: description || '',
      rating: rating ? Number(rating) : 8.0,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
    });

    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const { title, genre, language, duration, posterUrl, bannerUrl, description, rating, releaseDate } = req.body;

    movie.title = title ?? movie.title;
    if (genre) {
      movie.genre = Array.isArray(genre)
        ? genre
        : genre.split(',').map((g) => g.trim());
    }
    movie.language = language ?? movie.language;
    movie.duration = duration !== undefined ? Number(duration) : movie.duration;
    movie.posterUrl = posterUrl ?? movie.posterUrl;
    movie.bannerUrl = bannerUrl ?? movie.bannerUrl;
    movie.description = description ?? movie.description;
    movie.rating = rating !== undefined ? Number(rating) : movie.rating;
    movie.releaseDate = releaseDate ? new Date(releaseDate) : movie.releaseDate;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a movie and associated shows/seats
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Cascade delete shows and seats for this movie
    const shows = await Show.find({ movieId: movie._id });
    const showIds = shows.map((s) => s._id);

    await Seat.deleteMany({ showId: { $in: showIds } });
    await Show.deleteMany({ movieId: movie._id });
    await Movie.findByIdAndDelete(req.params.id);

    res.json({ message: 'Movie, related shows, and seats deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
