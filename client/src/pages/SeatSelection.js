import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import SeatMatrix from '../components/SeatMatrix';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowAndSeats();

    // Socket.io Room Join
    if (socket) {
      socket.emit('joinShow', showId);

      socket.on('seatsUpdated', ({ showId: updatedShowId, bookedSeats, releasedSeats, action }) => {
        if (updatedShowId === showId) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) => {
              if (action === 'booked' && bookedSeats?.includes(seat.seatNumber)) {
                return { ...seat, isBooked: true };
              }
              if (action === 'released' && releasedSeats?.includes(seat.seatNumber)) {
                return { ...seat, isBooked: false };
              }
              return seat;
            })
          );

          // If a currently selected seat was just booked by someone else
          if (action === 'booked' && bookedSeats) {
            setSelectedSeats((prevSelected) => {
              const conflict = prevSelected.filter((s) => bookedSeats.includes(s));
              if (conflict.length > 0) {
                toast.warning(`Seats ${conflict.join(', ')} were just taken by another customer.`);
              }
              return prevSelected.filter((s) => !bookedSeats.includes(s));
            });
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveShow', showId);
        socket.off('seatsUpdated');
      }
    };
  }, [showId, socket]);

  const fetchShowAndSeats = async () => {
    try {
      setLoading(true);
      const [showRes, seatsRes] = await Promise.all([
        axiosInstance.get(`/shows/${showId}`),
        axiosInstance.get(`/seats/show/${showId}`),
      ]);
      setShow(showRes.data);
      setSeats(seatsRes.data);
    } catch (err) {
      console.error('Error fetching show/seat data:', err);
      toast.error('Could not load seat matrix');
    } finally {
      setLoading(false);
    }
  };

  const calculateSeatPrice = (basePrice, seatType) => {
    if (seatType === 'VIP') return Math.round(basePrice * 1.3);
    if (seatType === 'PREMIUM') return Math.round(basePrice * 1.15);
    return basePrice;
  };

  const handleToggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        toast.info('Maximum 8 seats can be selected per booking');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Calculate total price based on tiers
  const calculateTotal = () => {
    if (!show) return 0;
    return selectedSeats.reduce((sum, seatNum) => {
      const seatObj = seats.find((s) => s.seatNumber === seatNum);
      const type = seatObj ? seatObj.seatType : 'STANDARD';
      return sum + calculateSeatPrice(show.ticketPrice, type);
    }, 0);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.info('Please sign in to proceed with booking');
      navigate('/login', { state: { from: `/show/${showId}/seats` } });
      return;
    }

    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat to proceed');
      return;
    }

    // Save booking intent state and navigate to checkout
    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
        totalAmount: calculateTotal(),
      },
    });
  };

  if (loading || !show) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Loading interactive cinema layout...</p>
      </div>
    );
  }

  const showTimeStr = new Date(show.showTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const showDateStr = new Date(show.showTime).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="container py-4">
      {/* Show Header Info */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-danger mb-2">Live Seat Reservation</span>
            <h3 className="fw-bold text-white mb-1">{show.movieId?.title}</h3>
            <p className="text-muted small mb-0">
              <i className="bi bi-geo-alt text-danger me-1"></i>
              {show.theatreId?.name}, {show.theatreId?.city} &bull; Hall {show.hallNumber || 1}
            </p>
          </div>

          <div className="text-md-end">
            <div className="fw-bold text-light fs-5">
              <i className="bi bi-calendar-event me-2 text-info"></i>
              {showDateStr} at {showTimeStr}
            </div>
            <span className="badge bg-secondary">Dolby Atmos &bull; 4K Projection</span>
          </div>
        </div>
      </div>

      {/* Main Seat Selection Grid */}
      <div className="glass-card p-4 mb-4 overflow-auto">
        <SeatMatrix
          seats={seats}
          selectedSeats={selectedSeats}
          onToggleSeat={handleToggleSeat}
        />
      </div>

      {/* Booking Summary Floating Bar */}
      <div className="glass-card p-4 sticky-bottom border border-danger border-opacity-25 shadow-lg">
        <div className="row align-items-center g-3">
          <div className="col-md-7">
            <h6 className="text-muted small fw-bold text-uppercase mb-1">Selected Seats</h6>
            <div className="d-flex flex-wrap gap-2">
              {selectedSeats.length === 0 ? (
                <span className="text-muted small">No seats selected yet. Click on green seats above.</span>
              ) : (
                selectedSeats.map((seatNum) => (
                  <span key={seatNum} className="badge bg-warning text-dark fw-bold px-2.5 py-1.5 fs-6">
                    {seatNum}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="col-md-5 d-flex justify-content-md-end align-items-center gap-4">
            <div>
              <div className="text-muted small">Total Price</div>
              <div className="fs-3 fw-bold text-white">₹{calculateTotal()}</div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0}
              className="btn btn-brand btn-lg d-flex align-items-center gap-2"
            >
              <span>Proceed to Pay</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
