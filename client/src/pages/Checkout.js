import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { show, selectedSeats, totalAmount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [processing, setProcessing] = useState(false);

  // Form states for mock checkout
  const [cardName, setCardName] = useState('Alex Johnson');
  const [cardNumber, setCardNumber] = useState('4532 8921 7843 1092');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [upiId, setUpiId] = useState('alex@okaxis');

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5">
          <i className="bi bi-cart-x fs-1 text-danger mb-3 d-block"></i>
          <h4>No Active Booking Session</h4>
          <p className="text-muted">Please select a movie and seats first.</p>
          <button onClick={() => navigate('/')} className="btn btn-brand mt-2">
            Return to Movies
          </button>
        </div>
      </div>
    );
  }

  const convenienceFee = Math.round(selectedSeats.length * 30);
  const tax = Math.round((totalAmount + convenienceFee) * 0.18);
  const grandTotal = totalAmount + convenienceFee + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate real bank gateway latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const payload = {
        showId: show._id,
        seatNumbers: selectedSeats,
        paymentMethod: paymentMethod,
      };

      const res = await axiosInstance.post('/bookings', payload);
      toast.success('Payment authorized and booking confirmed!');
      navigate(`/confirmation/${res.data._id}`);
    } catch (error) {
      console.error('Payment/Booking Error:', error);
      const msg = error.response?.data?.message || 'Payment failed or seats are no longer available.';
      toast.error(msg);
      setProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-extrabold text-white">Payment Checkout</h2>
        <p className="text-muted small">Complete your reservation with our secure mock payment gateway</p>
      </div>

      <div className="row g-4">
        {/* Left: Payment Method & Details Form */}
        <div className="col-lg-7">
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold text-white mb-3">1. Select Payment Method</h5>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {['Credit Card', 'Debit Card', 'UPI', 'Net Banking'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`btn btn-sm px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                    paymentMethod === method
                      ? 'btn-danger'
                      : 'btn-dark border border-secondary text-light'
                  }`}
                >
                  <i
                    className={`bi ${
                      method.includes('Card')
                        ? 'bi-credit-card-2-front'
                        : method === 'UPI'
                        ? 'bi-qr-code-scan'
                        : 'bi-bank'
                    }`}
                  ></i>
                  <span>{method}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod.includes('Card') ? (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold">Card Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted">
                        <i className="bi bi-credit-card"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <label className="form-label text-muted small fw-bold">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="MM/YY"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label text-muted small fw-bold">CVV</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="3 digits"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              ) : paymentMethod === 'UPI' ? (
                <div>
                  <label className="form-label text-muted small fw-bold">Virtual Payment Address (VPA / UPI ID)</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-dark border-secondary text-muted">@</span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="username@bank"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="alert alert-dark border border-secondary text-muted small">
                    <i className="bi bi-info-circle me-1 text-info"></i>
                    A collect request will be simulated and auto-approved for this project.
                  </div>
                </div>
              ) : (
                <div>
                  <label className="form-label text-muted small fw-bold">Select Bank</label>
                  <select className="form-select bg-dark text-light border-secondary mb-3">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-brand btn-lg py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                      <span>Verifying & Reserving Seats...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill"></i>
                      <span>Pay ₹{grandTotal} & Confirm</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Booking Summary Receipt */}
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold text-white mb-3">Order Summary</h5>

            <div className="d-flex gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
              <img
                src={show.movieId?.posterUrl}
                alt={show.movieId?.title}
                className="rounded-3"
                style={{ width: '70px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-white mb-1">{show.movieId?.title}</h6>
                <div className="text-muted small mb-1">
                  <i className="bi bi-geo-alt text-danger me-1"></i>
                  {show.theatreId?.name}
                </div>
                <div className="text-info small">
                  {new Date(show.showTime).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-muted small d-block mb-1">Selected Seats:</span>
              <div className="d-flex flex-wrap gap-1">
                {selectedSeats.map((s) => (
                  <span key={s} className="badge bg-warning text-dark fw-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-top border-secondary border-opacity-25 pt-3">
              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Tickets Subtotal ({selectedSeats.length} seats)</span>
                <span className="text-light">₹{totalAmount}</span>
              </div>
              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Convenience Fee</span>
                <span className="text-light">₹{convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between text-muted small mb-3">
                <span>Integrated GST (18%)</span>
                <span className="text-light">₹{tax}</span>
              </div>

              <div className="d-flex justify-content-between text-white fw-bold fs-5 border-top border-secondary border-opacity-50 pt-3">
                <span>Total Amount</span>
                <span className="text-danger">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
