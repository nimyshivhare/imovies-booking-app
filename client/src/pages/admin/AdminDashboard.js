import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    moviesCount: 0,
    theatresCount: 0,
    showsCount: 0,
    bookingsCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const [moviesRes, theatresRes, showsRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/movies'),
        axiosInstance.get('/theatres'),
        axiosInstance.get('/shows'),
        axiosInstance.get('/bookings'),
      ]);

      const movies = moviesRes.data;
      const theatres = theatresRes.data;
      const shows = showsRes.data;
      const bookings = bookingsRes.data;

      const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED');
      const revenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      setStats({
        moviesCount: movies.length,
        theatresCount: theatres.length,
        showsCount: shows.length,
        bookingsCount: bookings.length,
        totalRevenue: revenue,
      });
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-danger text-uppercase px-2.5 py-1 mb-2">Administration Portal</span>
          <h2 className="fw-extrabold text-white mb-0">Theatre & Operations Control Panel</h2>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/shows" className="btn btn-sm btn-brand d-flex align-items-center gap-1">
            <i className="bi bi-calendar-plus"></i>
            <span>Schedule Show</span>
          </Link>
          <Link to="/admin/movies" className="btn btn-sm btn-outline-light d-flex align-items-center gap-1">
            <i className="bi bi-film"></i>
            <span>Add Movie</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2">Aggregating system statistics...</p>
        </div>
      ) : (
        <>
          {/* Analytics Overview Cards */}
          <div className="row g-4 mb-5">
            <div className="col-sm-6 col-lg-3">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Total Movies</span>
                  <div className="p-2 bg-danger bg-opacity-25 text-danger rounded-3">
                    <i className="bi bi-film fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-white mb-0">{stats.moviesCount}</h3>
                <span className="text-muted small">Catalogued across genres</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Active Theatres</span>
                  <div className="p-2 bg-info bg-opacity-25 text-info rounded-3">
                    <i className="bi bi-building fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-white mb-0">{stats.theatresCount}</h3>
                <span className="text-muted small">Partner cinema halls</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Scheduled Shows</span>
                  <div className="p-2 bg-warning bg-opacity-25 text-warning rounded-3">
                    <i className="bi bi-clock-history fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-white mb-0">{stats.showsCount}</h3>
                <span className="text-muted small">Upcoming screenings</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small fw-bold text-uppercase">Gross Revenue</span>
                  <div className="p-2 bg-success bg-opacity-25 text-success rounded-3">
                    <i className="bi bi-currency-rupee fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-extrabold text-success mb-0">₹{stats.totalRevenue.toLocaleString()}</h3>
                <span className="text-muted small">From {stats.bookingsCount} customer bookings</span>
              </div>
            </div>
          </div>

          {/* Quick Management Navigation Grid */}
          <h4 className="fw-bold text-white mb-3">Management Modules</h4>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-film fs-2 text-danger mb-2 d-block"></i>
                  <h5 className="fw-bold text-white">Manage Movies</h5>
                  <p className="text-muted small">Add new film titles, modify poster artwork, duration, and metadata.</p>
                </div>
                <Link to="/admin/movies" className="btn btn-sm btn-outline-danger w-100">
                  Open Movies
                </Link>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-building fs-2 text-info mb-2 d-block"></i>
                  <h5 className="fw-bold text-white">Manage Theatres</h5>
                  <p className="text-muted small">Configure cinema complexes, branch locations, and auditorium counts.</p>
                </div>
                <Link to="/admin/theatres" className="btn btn-sm btn-outline-info w-100">
                  Open Theatres
                </Link>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-calendar3 fs-2 text-warning mb-2 d-block"></i>
                  <h5 className="fw-bold text-white">Schedule Shows</h5>
                  <p className="text-muted small">Assign movies to theatres, time slots, set ticket prices, auto-generate seats.</p>
                </div>
                <Link to="/admin/shows" className="btn btn-sm btn-outline-warning w-100">
                  Open Shows
                </Link>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-receipt fs-2 text-success mb-2 d-block"></i>
                  <h5 className="fw-bold text-white">Customer Bookings</h5>
                  <p className="text-muted small">Audit all transactions, customer seats, payment status, and process cancellations.</p>
                </div>
                <Link to="/admin/bookings" className="btn btn-sm btn-outline-success w-100">
                  Open Bookings
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
