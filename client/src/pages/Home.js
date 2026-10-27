import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');

  const genresList = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Crime', 'History'];
  const languagesList = ['All', 'English', 'Hindi', 'Spanish', 'French'];

  useEffect(() => {
    fetchMovies();
  }, [genre, language]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (genre !== 'All') params.genre = genre;
      if (language !== 'All') params.language = language;

      const res = await axiosInstance.get('/movies', { params });
      setMovies(res.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="container py-4">
      {/* Cinematic Hero Banner */}
      <div
        className="hero-banner shadow-lg"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80")',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-light">
          <span className="badge bg-danger text-uppercase px-3 py-2 mb-3 rounded-pill fw-semibold">
            <i className="bi bi-fire me-1"></i> Blockbusters In Theatres Now
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            Movie Ticket Booking <br />
            <span className="text-danger">Made Simple.</span>
          </h1>
          <p className="lead text-light text-opacity-75 mb-4">
            Pick your favourite film, choose your luxury seats in real-time, and get your digital e-ticket in seconds.
          </p>
          <a href="#catalog" className="btn btn-brand btn-lg d-inline-flex align-items-center gap-2">
            <i className="bi bi-play-circle-fill"></i>
            <span>Browse Now Showing</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div id="catalog" className="glass-card p-4 mb-5">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label className="form-label text-muted small fw-bold">Search Movie Title</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search by title (e.g. Oppenheimer)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label text-muted small fw-bold">Genre</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genresList.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <label className="form-label text-muted small fw-bold">Language</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languagesList.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2 d-grid">
            <button type="submit" className="btn btn-brand">
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Movies Grid */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-white mb-0">
          Now Showing <span className="text-danger">({movies.length})</span>
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading available movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="glass-card text-center p-5 my-4">
          <i className="bi bi-film fs-1 text-muted mb-3 d-block"></i>
          <h4 className="text-light">No movies found</h4>
          <p className="text-muted">Try resetting your search query or selecting a different genre.</p>
          <button
            onClick={() => {
              setSearch('');
              setGenre('All');
              setLanguage('All');
            }}
            className="btn btn-outline-danger btn-sm mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {movies.map((movie) => (
            <div key={movie._id} className="col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
