import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate 4 consecutive days for show filtering
  const dateOptions = Array.from({ length: 4 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    return {
      value: d.toISOString().split('T')[0],
      dayName: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    fetchShowsForDate();
  }, [id, selectedDate]);

  const fetchMovieDetails = async () => {
    try {
      const res = await axiosInstance.get(`/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
    }
  };

  const fetchShowsForDate = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/shows', {
        params: {
          movieId: id,
          date: selectedDate,
        },
      });
      setShows(res.data);
    } catch (err) {
      console.error('Error fetching shows:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group shows by Theatre
  const theatreMap = shows.reduce((acc, show) => {
    if (!show.theatreId) return acc;
    const tid = show.theatreId._id;
    if (!acc[tid]) {
      acc[tid] = {
        theatre: show.theatreId,
        shows: [],
      };
    }
    acc[tid].shows.push(show);
    return acc;
  }, {});

  const groupedTheatres = Object.values(theatreMap);

  if (!movie) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Movie Banner Backdrop */}
      <div
        className="position-relative py-5"
        style={{
          background: `linear-gradient(rgba(11, 15, 25, 0.9), rgba(11, 15, 25, 0.97)), url(${movie.bannerUrl || movie.posterUrl}) center/cover no-repeat`,
          minHeight: '420px',
        }}
      >
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-50"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <div className="col-md-8 col-lg-9 text-light">
              <div className="d-flex flex-wrap gap-2 mb-2">
                {movie.genre?.map((g) => (
                  <span key={g} className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-2 py-1">
                    {g}
                  </span>
                ))}
                <span className="badge bg-secondary">{movie.language}</span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-2">{movie.title}</h1>

              <div className="d-flex align-items-center gap-3 text-muted mb-3">
                <span className="text-warning fw-bold d-flex align-items-center gap-1">
                  <i className="bi bi-star-fill"></i> {movie.rating || '8.5'} / 10
                </span>
                <span>&bull;</span>
                <span>
                  <i className="bi bi-clock me-1"></i> {movie.duration} Minutes
                </span>
                <span>&bull;</span>
                <span>
                  <i className="bi bi-calendar3 me-1"></i>{' '}
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h5 className="fw-semibold text-white mt-4 mb-2">About the Movie</h5>
              <p className="text-light text-opacity-75 lead fs-6" style={{ maxWidth: '800px' }}>
                {movie.description || 'Experience an unforgettable cinematic adventure in pristine IMAX audio and visuals.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Theatre Selection Section */}
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h3 className="fw-bold text-white mb-0">Select Date & Showtimes</h3>

          {/* Date Selector Tabs */}
          <div className="d-flex gap-2 overflow-auto pb-2">
            {dateOptions.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`btn btn-sm text-nowrap rounded-3 px-3 py-2 ${
                  selectedDate === d.value ? 'btn-danger shadow' : 'btn-dark border border-secondary text-muted'
                }`}
              >
                <div className="fw-bold">{d.dayName}</div>
                <div style={{ fontSize: '0.75rem' }}>{d.formattedDate}</div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-muted mt-2">Checking theatre schedules...</p>
          </div>
        ) : groupedTheatres.length === 0 ? (
          <div className="glass-card text-center p-5">
            <i className="bi bi-calendar-x fs-1 text-muted mb-2 d-block"></i>
            <h5 className="text-light">No shows available for this date</h5>
            <p className="text-muted small">Please select another date above to view upcoming screenings.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {groupedTheatres.map(({ theatre, shows: tShows }) => (
              <div key={theatre._id} className="glass-card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-3">
                  <div>
                    <h5 className="fw-bold text-white mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      {theatre.name}
                    </h5>
                    <p className="text-muted small mb-0">
                      {theatre.location}, <span className="text-info">{theatre.city}</span>
                    </p>
                  </div>
                  <div className="text-md-end mt-2 mt-md-0">
                    <span className="badge bg-dark border border-secondary text-secondary">
                      Hall 1 &bull; Dolby Atmos 7.1
                    </span>
                  </div>
                </div>

                {/* Showtime Buttons */}
                <div className="d-flex flex-wrap gap-3">
                  {tShows.map((show) => {
                    const timeString = new Date(show.showTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });

                    return (
                      <button
                        key={show._id}
                        onClick={() => navigate(`/show/${show._id}/seats`)}
                        className="btn btn-outline-success text-light border border-success border-opacity-50 px-3 py-2 rounded-3 text-start transition-all"
                        style={{ minWidth: '130px' }}
                      >
                        <div className="fw-bold text-emerald text-success">{timeString}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          ₹{show.ticketPrice} &bull; 4K Laser
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
