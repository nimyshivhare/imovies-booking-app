import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('8.5');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
      toast.error('Could not fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        title,
        genre: genre.split(',').map((g) => g.trim()),
        language,
        duration: Number(duration),
        posterUrl,
        bannerUrl,
        description,
        rating: Number(rating),
        releaseDate,
      };

      const res = await axiosInstance.post('/movies', payload);
      toast.success(`Movie "${res.data.title}" created successfully!`);
      setMovies([res.data, ...movies]);

      // Reset form
      setTitle('');
      setGenre('');
      setDuration('');
      setPosterUrl('');
      setBannerUrl('');
      setDescription('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding movie:', err);
      toast.error(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (!window.confirm(`Delete "${movieTitle}"? This will also remove any scheduled shows and seats for this movie.`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/movies/${movieId}`);
      toast.success(`Movie "${movieTitle}" deleted successfully`);
      setMovies(movies.filter((m) => m._id !== movieId));
    } catch (err) {
      console.error('Error deleting movie:', err);
      toast.error(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Movie Catalogue Management</h2>
          <p className="text-muted small mb-0">Create, edit, or retire films from theatrical screening</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-brand d-flex align-items-center gap-2"
        >
          <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
          <span>{showAddForm ? 'Close Form' : 'Add New Movie'}</span>
        </button>
      </div>

      {/* Add Movie Collapsible Form */}
      {showAddForm && (
        <div className="glass-card p-4 mb-4 border border-danger border-opacity-50">
          <h4 className="fw-bold text-white mb-3">Add New Movie</h4>
          <form onSubmit={handleAddMovie} className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Movie Title *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. Gladiator II"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Language *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. English"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Duration (Minutes) *</label>
              <input
                type="number"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. 145"
                required
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Genres (comma-separated) *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Action, Sci-Fi, Drama"
                required
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Rating (0 - 10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="form-control bg-dark text-light border-secondary"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Release Date *</label>
              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                required
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Poster Image URL *</label>
              <input
                type="url"
                className="form-control bg-dark text-light border-secondary"
                placeholder="https://images.unsplash.com/..."
                required
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Backdrop / Banner URL</label>
              <input
                type="url"
                className="form-control bg-dark text-light border-secondary"
                placeholder="https://images.unsplash.com/..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label text-muted small fw-bold">Synopsis / Storyline</label>
              <textarea
                className="form-control bg-dark text-light border-secondary"
                rows="3"
                placeholder="Brief description of the movie plot..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-brand">
                {submitting ? 'Saving...' : 'Save Movie'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Movies Table */}
      <div className="glass-card p-4 overflow-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger" role="status"></div>
          </div>
        ) : movies.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">No movies available. Click "Add New Movie" above.</p>
        ) : (
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr className="border-secondary text-muted small text-uppercase">
                <th>Movie</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Rating</th>
                <th>Release Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m._id} className="border-secondary border-opacity-50">
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded-2"
                        style={{ width: '45px', height: '60px', objectFit: 'cover' }}
                      />
                      <span className="fw-bold text-light">{m.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="small text-muted">
                      {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{m.language}</span>
                  </td>
                  <td>{m.duration} mins</td>
                  <td>
                    <span className="text-warning fw-bold small">
                      <i className="bi bi-star-fill me-1"></i> {m.rating}
                    </span>
                  </td>
                  <td className="small text-muted">
                    {new Date(m.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => handleDeleteMovie(m._id, m.title)}
                      className="btn btn-sm btn-outline-danger"
                      title="Delete Movie"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageMovies;
