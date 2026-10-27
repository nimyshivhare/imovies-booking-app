import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching all bookings:', err);
      toast.error('Could not load bookings list');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCancel = async (bookingId) => {
    if (!window.confirm('Admin override: Cancel this booking and issue a full refund to customer?')) {
      return;
    }

    try {
      const res = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      toast.success(res.data.message || 'Booking cancelled and seats released');
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-extrabold text-white mb-1">Customer Reservations & Transactions</h2>
        <p className="text-muted small">Real-time ledger of all cinema ticket purchases and refunds</p>
      </div>

      <div className="glass-card p-4 overflow-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-muted mt-2">Loading transactions...</p>
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">No bookings placed in the system yet.</p>
        ) : (
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr className="border-secondary text-muted small text-uppercase">
                <th>Customer</th>
                <th>Movie & Theatre</th>
                <th>Showtime</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const isCancelled = b.bookingStatus === 'CANCELLED';

                return (
                  <tr key={b._id} className="border-secondary border-opacity-50">
                    <td>
                      <div className="fw-bold text-light">{b.userId?.name || 'Customer'}</div>
                      <div className="text-muted small">{b.userId?.email || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-light">{b.showId?.movieId?.title}</div>
                      <div className="text-muted small">
                        {b.showId?.theatreId?.name} ({b.showId?.theatreId?.city})
                      </div>
                    </td>
                    <td>
                      <div className="small text-light">
                        {new Date(b.showId?.showTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-muted small">
                        {new Date(b.showId?.showTime).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark fw-bold">
                        {b.seatsReserved.join(', ')}
                      </span>
                    </td>
                    <td className="fw-bold text-light">₹{b.totalAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          isCancelled ? 'bg-danger' : 'bg-success'
                        } text-uppercase px-2 py-1`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="text-muted small font-monospace">
                      {b.paymentId?.transactionId || 'TXN-DIRECT'}
                    </td>
                    <td className="text-end">
                      {!isCancelled && (
                        <button
                          onClick={() => handleAdminCancel(b._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Admin Cancel & Refund"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
