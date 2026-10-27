import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released immediately.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      toast.success(res.data.message || 'Booking cancelled successfully');

      // Update state locally
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
      );
    } catch (error) {
      console.error('Cancel Booking Error:', error);
      toast.error(error.response?.data?.message || 'Could not cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();

  const upcomingBookings = bookings.filter((b) => {
    const showTime = new Date(b.showId?.showTime);
    return showTime >= now && b.bookingStatus === 'CONFIRMED';
  });

  const pastBookings = bookings.filter((b) => {
    const showTime = new Date(b.showId?.showTime);
    return showTime < now || b.bookingStatus === 'CANCELLED';
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-white mb-1">My Bookings Dashboard</h2>
          <p className="text-muted small mb-0">View tickets, manage upcoming screenings, or request cancellations</p>
        </div>

        {/* Tab Buttons */}
        <div className="d-flex gap-2 bg-dark p-1 rounded-3 border border-secondary border-opacity-50">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`btn btn-sm px-3 rounded-2 ${
              activeTab === 'upcoming' ? 'btn-danger shadow' : 'text-muted'
            }`}
          >
            Upcoming Shows ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`btn btn-sm px-3 rounded-2 ${
              activeTab === 'past' ? 'btn-danger shadow' : 'text-muted'
            }`}
          >
            Past & Cancelled ({pastBookings.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2">Loading your tickets...</p>
        </div>
      ) : displayedBookings.length === 0 ? (
        <div className="glass-card text-center p-5">
          <i className="bi bi-ticket-perforated fs-1 text-muted mb-3 d-block"></i>
          <h4>No {activeTab} bookings found</h4>
          <p className="text-muted">Explore the latest movies and reserve your seats now.</p>
          <Link to="/" className="btn btn-brand mt-2">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {displayedBookings.map((b) => {
            const showTime = new Date(b.showId?.showTime);
            const isCancelled = b.bookingStatus === 'CANCELLED';

            return (
              <div key={b._id} className="col-lg-6">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span
                        className={`badge ${
                          isCancelled ? 'bg-secondary' : 'bg-success'
                        } text-uppercase px-2.5 py-1.5`}
                      >
                        {b.bookingStatus}
                      </span>
                      <span className="text-muted small">
                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="d-flex gap-3 mb-3">
                      <img
                        src={b.showId?.movieId?.posterUrl}
                        alt={b.showId?.movieId?.title}
                        className="rounded-3"
                        style={{ width: '80px', height: '110px', objectFit: 'cover' }}
                      />
                      <div>
                        <h5 className="fw-bold text-white mb-1">{b.showId?.movieId?.title}</h5>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {b.showId?.theatreId?.name}, {b.showId?.theatreId?.city}
                        </p>
                        <p className="text-info small mb-0">
                          <i className="bi bi-clock me-1"></i>
                          {showTime.toLocaleString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-dark bg-opacity-50 p-3 rounded-3 mb-3 border border-secondary border-opacity-25">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Seats Reserved:</span>
                        <span className="fw-bold text-warning">{b.seatsReserved.join(', ')}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Total Paid:</span>
                        <span className="fw-bold text-light">₹{b.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 pt-2 border-top border-secondary border-opacity-25">
                    <Link
                      to={`/confirmation/${b._id}`}
                      className="btn btn-sm btn-outline-light flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    >
                      <i className="bi bi-eye"></i>
                      <span>View Ticket</span>
                    </Link>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="btn btn-sm btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      >
                        {cancellingId === b._id ? (
                          <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : (
                          <>
                            <i className="bi bi-x-circle"></i>
                            <span>Cancel Ticket</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
