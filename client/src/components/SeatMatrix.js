import React from 'react';

const SeatMatrix = ({ seats, selectedSeats, onToggleSeat }) => {
  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatBadgeColor = (type) => {
    switch (type) {
      case 'VIP':
        return 'text-warning';
      case 'PREMIUM':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="w-100 py-3">
      {/* Cinema Screen Projection */}
      <div className="cinema-screen-curve d-flex align-items-center justify-content-center">
        <span>CINEMA SCREEN THIS WAY</span>
      </div>

      {/* Seat Rows Grid */}
      <div className="d-flex flex-column align-items-center gap-3">
        {rows.map((rowLetter) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          if (rowSeats.length === 0) return null;

          const rowType = rowSeats[0]?.seatType || 'STANDARD';

          return (
            <div key={rowLetter} className="d-flex align-items-center gap-2 gap-md-3">
              <span className={`fw-bold small me-1 ${getSeatBadgeColor(rowType)}`} style={{ width: '20px' }}>
                {rowLetter}
              </span>

              <div className="d-flex gap-1 gap-sm-2">
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  const isBooked = seat.isBooked;

                  let seatClass = 'seat-available';
                  if (isBooked) {
                    seatClass = 'seat-booked';
                  } else if (isSelected) {
                    seatClass = 'seat-selected';
                  }

                  return (
                    <div
                      key={seat._id}
                      className={`seat-box ${seatClass}`}
                      onClick={() => !isBooked && onToggleSeat(seat.seatNumber, seat.seatType)}
                      title={`${seat.seatNumber} (${seat.seatType}) ${isBooked ? '- Booked' : '- Available'}`}
                    >
                      {seat.seatNumber}
                    </div>
                  );
                })}
              </div>

              <span className={`fw-bold small ms-1 ${getSeatBadgeColor(rowType)}`} style={{ width: '20px' }}>
                {rowLetter}
              </span>
            </div>
          );
        })}
      </div>

      {/* Seat Category & Status Legends */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mt-5 pt-3 border-top border-secondary border-opacity-25 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <div className="seat-box seat-available" style={{ width: '24px', height: '24px' }}></div>
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-box seat-selected" style={{ width: '24px', height: '24px' }}></div>
          <span>Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-box seat-booked" style={{ width: '24px', height: '24px' }}></div>
          <span>Booked</span>
        </div>
        <div className="d-flex align-items-center gap-2 ms-md-4">
          <span className="badge bg-warning text-dark">A-B: VIP (+30%)</span>
          <span className="badge bg-info text-dark">C-D: Premium (+15%)</span>
          <span className="badge bg-secondary">E-F: Standard</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMatrix;
