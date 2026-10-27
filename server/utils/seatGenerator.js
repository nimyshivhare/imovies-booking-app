const Seat = require('../models/Seat');

/**
 * Generates cinema hall seats for a newly scheduled show.
 * Rows A-B: VIP ($+30%)
 * Rows C-D: PREMIUM ($+15%)
 * Rows E-F: STANDARD
 * Columns: 1 to 10
 */
const generateSeatsForShow = async (showId) => {
  const rows = [
    { row: 'A', type: 'VIP' },
    { row: 'B', type: 'VIP' },
    { row: 'C', type: 'PREMIUM' },
    { row: 'D', type: 'PREMIUM' },
    { row: 'E', type: 'STANDARD' },
    { row: 'F', type: 'STANDARD' },
  ];

  const seatsToInsert = [];

  for (const r of rows) {
    for (let num = 1; num <= 10; num++) {
      seatsToInsert.push({
        showId: showId,
        seatNumber: `${r.row}${num}`,
        row: r.row,
        seatType: r.type,
        isBooked: false,
        bookedBy: null,
      });
    }
  }

  return await Seat.insertMany(seatsToInsert);
};

module.exports = {
  generateSeatsForShow,
};
