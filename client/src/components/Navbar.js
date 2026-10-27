import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 border-bottom border-secondary border-opacity-25 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white" to="/">
          <span className="badge bg-danger p-2 rounded-3">
            <i className="bi bi-film"></i>
          </span>
          <span>
            <span className="text-danger">I</span>Movies
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#imoviesNavbar"
          aria-controls="imoviesNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="imoviesNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link fw-semibold" to="/">
                <i className="bi bi-compass me-1"></i> Explore Movies
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link fw-semibold" to="/dashboard">
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link fw-semibold text-warning" to="/admin">
                  <i className="bi bi-shield-lock-fill me-1"></i> Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 px-3 py-1.5 rounded-pill border border-secondary border-opacity-50">
                  <i className="bi bi-person-circle text-info fs-5"></i>
                  <span className="fw-medium small text-light">{user.name}</span>
                  {isAdmin && (
                    <span className="badge bg-danger text-uppercase px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-brand-outline">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-brand">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
