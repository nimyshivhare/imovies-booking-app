import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axiosInstance.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error('Error fetching booking confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Retrieving your confirmed ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5">
          <i className="bi bi-exclamation-triangle-fill fs-1 text-warning mb-3 d-block"></i>
          <h4>Booking Not Found</h4>
          <p className="text-muted">We could not retrieve the requested ticket details.</p>
          <Link to="/" className="btn btn-brand mt-2">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { showId: show, paymentId: payment } = booking;
  const showDate = new Date(show?.showTime).toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const showTime = new Date(show?.showTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <div className="d-inline-flex p-3 bg-success bg-opacity-25 text-success rounded-circle mb-3">
          <i className="bi bi-check-circle-fill fs-1"></i>
        </div>
        <h2 className="fw-extrabold text-white">Booking Confirmed!</h2>
        <p className="text-muted">Your seats are secured. Show this digital e-ticket at the cinema entrance.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Stylized E-Ticket */}
          <div className="ticket-wrapper p-4 p-md-5 shadow-lg border-0 mb-4">
            <div className="row g-4 align-items-center">
              <div className="col-md-4 text-center">
                <img
                  src={show?.movieId?.posterUrl}
                  alt={show?.movieId?.title}
                  className="img-fluid rounded-3 shadow mb-3"
                  style={{ maxHeight: '240px', objectFit: 'cover' }}
                />
                <span className="badge bg-danger text-uppercase px-2 py-1">
                  {booking.bookingStatus}
                </span>
              </div>

              <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="fw-bold text-white mb-0">{show?.movieId?.title}</h3>
                  <span className="badge bg-dark border border-secondary text-info">
                    {show?.movieId?.language}
                  </span>
                </div>

                <p className="text-muted small mb-3">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {show?.theatreId?.name}, {show?.theatreId?.city} &bull; Audi {show?.hallNumber || 1}
                </p>

                <div className="row g-3 py-3 border-top border-bottom border-secondary border-opacity-50">
                  <div className="col-6">
                    <span className="text-muted small d-block">Screening Date</span>
                    <span className="fw-bold text-light">{showDate}</span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">Showtime</span>
                    <span className="fw-bold text-warning">{showTime}</span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">Reserved Seats</span>
                    <span className="fw-bold text-success fs-5">
                      {booking.seatsReserved.join(', ')}
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">Total Paid</span>
                    <span className="fw-bold text-white fs-5">₹{booking.totalAmount}</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 small text-muted">
                  <div>
                    <div>
                      <strong className="text-light">Booking ID:</strong> {booking._id}
                    </div>
                    {payment && (
                      <div>
                        <strong className="text-light">Txn ID:</strong> {payment.transactionId}
                      </div>
                    )}
                  </div>

                  {/* Mock Cinema Gate QR Code */}
                  <div className="text-center mt-2 mt-sm-0 p-2 bg-white rounded-2">
                    <i className="bi bi-qr-code text-dark fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              onClick={() => window.print()}
              className="btn btn-outline-light d-flex align-items-center gap-2 px-4 py-2"
            >
              <i className="bi bi-printer"></i>
              <span>Print / Save E-Ticket</span>
            </button>
            <Link to="/dashboard" className="btn btn-brand d-flex align-items-center gap-2 px-4 py-2">
              <i className="bi bi-ticket-perforated"></i>
              <span>Go to My Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
