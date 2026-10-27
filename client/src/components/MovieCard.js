import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="card h-100 glass-card movie-card text-white border-0 overflow-hidden">
      <div className="position-relative overflow-hidden" style={{ height: '360px' }}>
        <img
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
          alt={movie.title}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="position-absolute top-0 end-0 m-3">
          <span className="badge bg-warning text-dark fw-bold px-2 py-1 shadow d-flex align-items-center gap-1">
            <i className="bi bi-star-fill"></i> {movie.rating || '8.5'}
          </span>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-gradient bg-dark bg-opacity-75">
          <span className="badge bg-danger me-1">{movie.language}</span>
          <span className="badge bg-secondary">{movie.duration}m</span>
        </div>
      </div>

      <div className="card-body d-flex flex-direction-column flex-column justify-content-between p-3">
        <div>
          <h5 className="card-title fw-bold text-truncate mb-1" title={movie.title}>
            {movie.title}
          </h5>
          <p className="card-text text-muted small text-truncate mb-2">
            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
          </p>
        </div>

        <Link
          to={`/movie/${movie._id}`}
          className="btn btn-sm btn-brand w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
        >
          <i className="bi bi-ticket-detailed-fill"></i>
          <span>Book Tickets</span>
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
