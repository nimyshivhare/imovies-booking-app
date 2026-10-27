import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [movieId, setMovieId] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [showTime, setShowTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState('250');
  const [hallNumber, setHallNumber] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        axiosInstance.get('/shows'),
        axiosInstance.get('/movies'),
        axiosInstance.get('/theatres'),
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheatres(theatresRes.data);

      if (moviesRes.data.length > 0) setMovieId(moviesRes.data[0]._id);
      if (theatresRes.data.length > 0) setTheatreId(theatresRes.data[0]._id);
    } catch (err) {
      console.error('Error fetching show schedule data:', err);
      toast.error('Could not load show schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    if (!movieId || !theatreId || !showTime || !ticketPrice) {
      toast.error('Please fill in all show details');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        movieId,
        theatreId,
        showTime,
        ticketPrice: Number(ticketPrice),
        hallNumber: Number(hallNumber),
      };

      const res = await axiosInstance.post('/shows', payload);
      toast.success('Show scheduled & 60 seats generated automatically!');
      setShows([res.data, ...shows]);
      setShowTime('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error scheduling show:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule show');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Delete this show? All 60 associated seats and bookings will be cleared.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/shows/${showId}`);
      toast.success('Show deleted successfully');
      setShows(shows.filter((s) => s._id !== showId));
    } catch (err) {
      console.error('Error deleting show:', err);
      toast.error(err.response?.data?.message || 'Failed to delete show');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Show Scheduling & Timings</h2>
          <p className="text-muted small mb-0">Assign movies to auditoriums and auto-generate seat maps</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-brand d-flex align-items-center gap-2"
        >
          <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
          <span>{showAddForm ? 'Close Form' : 'Schedule New Show'}</span>
        </button>
      </div>

      {/* Add Show Form */}
      {showAddForm && (
        <div className="glass-card p-4 mb-4 border border-warning border-opacity-50">
          <h4 className="fw-bold text-white mb-3">Schedule New Screening</h4>

          <div className="alert alert-dark border border-secondary text-info small mb-3">
            <i className="bi bi-info-circle-fill me-2"></i>
            <strong>Auto-Seating Engine:</strong> When you submit this form, 60 cinema seats (A1-A10 VIP, C1-D10 Premium, E1-F10 Standard) are automatically provisioned in the database.
          </div>

          <form onSubmit={handleCreateShow} className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Select Movie *</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                required
              >
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title} ({m.language}) - {m.duration}m
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Select Theatre Complex *</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={theatreId}
                onChange={(e) => setTheatreId(e.target.value)}
                required
              >
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold">Show Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control bg-dark text-light border-secondary"
                required
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold">Standard Ticket Base Price (₹) *</label>
              <input
                type="number"
                min={50}
                className="form-control bg-dark text-light border-secondary"
                required
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold">Auditorium / Hall Number</label>
              <input
                type="number"
                min={1}
                className="form-control bg-dark text-light border-secondary"
                required
                value={hallNumber}
                onChange={(e) => setHallNumber(e.target.value)}
              />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-brand">
                {submitting ? 'Creating Show...' : 'Confirm & Schedule Show'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shows List */}
      <div className="glass-card p-4 overflow-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger" role="status"></div>
          </div>
        ) : shows.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">No shows scheduled yet. Click "Schedule New Show" above.</p>
        ) : (
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr className="border-secondary text-muted small text-uppercase">
                <th>Movie Title</th>
                <th>Theatre & City</th>
                <th>Hall</th>
                <th>Screening Time</th>
                <th>Base Price</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((s) => (
                <tr key={s._id} className="border-secondary border-opacity-50">
                  <td className="fw-bold text-light">
                    {s.movieId?.title || 'Unknown Movie'}
                  </td>
                  <td>
                    <div>{s.theatreId?.name || 'Unknown Theatre'}</div>
                    <span className="badge bg-secondary small">{s.theatreId?.city}</span>
                  </td>
                  <td>Audi {s.hallNumber || 1}</td>
                  <td>
                    <div className="fw-semibold text-warning">
                      {new Date(s.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-muted small">
                      {new Date(s.showTime).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="fw-bold text-success">₹{s.ticketPrice}</td>
                  <td className="text-end">
                    <button
                      onClick={() => handleDeleteShow(s._id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Cancel & Delete Show"
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

export default ManageShows;
