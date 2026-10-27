const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { generateSeatsForShow } = require('../utils/seatGenerator');

const seedDataInternal = async () => {
  console.log('Clearing existing database collections...');
  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Theatre.deleteMany({}),
    Show.deleteMany({}),
    Seat.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  console.log('Creating Users...');
  const admin = await User.create({
    name: 'Admin Director',
    email: 'admin@imovies.com',
    password: 'admin123',
    role: 'admin',
  });

  const user1 = await User.create({
    name: 'Alex Johnson',
    email: 'user@imovies.com',
    password: 'user123',
    role: 'user',
  });

  const user2 = await User.create({
    name: 'Sophia Martinez',
    email: 'sophia@imovies.com',
    password: 'user123',
    role: 'user',
  });

  console.log('Creating Theatres...');
  const theatres = await Theatre.create([
    {
      name: 'PVR ICON Gold Superplex',
      location: 'Phoenix Palladium, Lower Parel',
      city: 'Mumbai',
      totalHalls: 6,
      phone: '+91 22 6677 8899',
    },
    {
      name: 'AMC Empire 25 IMAX',
      location: '234 W 42nd St, Times Square',
      city: 'New York',
      totalHalls: 8,
      phone: '+1 212 398 3939',
    },
    {
      name: 'Regal LA Live & 4DX',
      location: '1000 W Olympic Blvd',
      city: 'Los Angeles',
      totalHalls: 10,
      phone: '+1 844 462 7342',
    },
    {
      name: 'Cinepolis Megaplex Forum',
      location: 'Koramangala 7th Block',
      city: 'Bangalore',
      totalHalls: 5,
      phone: '+91 80 4123 4567',
    },
  ]);

  console.log('Creating Movies...');
  const movies = await Movie.create([
    {
      title: 'Oppenheimer',
      genre: ['Drama', 'History', 'Biography'],
      language: 'English',
      duration: 180,
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
      rating: 8.9,
      releaseDate: new Date('2023-07-21'),
    },
    {
      title: 'Dune: Part Two',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      language: 'English',
      duration: 166,
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      rating: 8.7,
      releaseDate: new Date('2024-03-01'),
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      genre: ['Animation', 'Action', 'Sci-Fi'],
      language: 'English',
      duration: 140,
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      rating: 8.8,
      releaseDate: new Date('2023-06-02'),
    },
    {
      title: 'Interstellar',
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      language: 'English',
      duration: 169,
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
      rating: 8.7,
      releaseDate: new Date('2014-11-07'),
    },
    {
      title: 'The Dark Knight',
      genre: ['Action', 'Crime', 'Drama'],
      language: 'English',
      duration: 152,
      posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
      description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest psychological and physical tests.',
      rating: 9.0,
      releaseDate: new Date('2008-07-18'),
    },
    {
      title: 'Inception',
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      language: 'English',
      duration: 148,
      posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      rating: 8.8,
      releaseDate: new Date('2010-07-16'),
    },
  ]);

  console.log('Scheduling Shows and generating seats...');
  const now = new Date();
  const shows = [];

  for (let dayOffset = 0; dayOffset <= 2; dayOffset++) {
    for (let tIndex = 0; tIndex < theatres.length; tIndex++) {
      const theatre = theatres[tIndex];
      const movie1 = movies[tIndex % movies.length];
      const movie2 = movies[(tIndex + 1) % movies.length];

      const time1 = new Date(now);
      time1.setDate(now.getDate() + dayOffset);
      time1.setHours(10, 30, 0, 0);

      const time2 = new Date(now);
      time2.setDate(now.getDate() + dayOffset);
      time2.setHours(14, 45, 0, 0);

      const time3 = new Date(now);
      time3.setDate(now.getDate() + dayOffset);
      time3.setHours(19, 0, 0, 0);

      const time4 = new Date(now);
      time4.setDate(now.getDate() + dayOffset);
      time4.setHours(22, 15, 0, 0);

      shows.push(
        { movieId: movie1._id, theatreId: theatre._id, showTime: time1, ticketPrice: 250, hallNumber: 1 },
        { movieId: movie1._id, theatreId: theatre._id, showTime: time3, ticketPrice: 320, hallNumber: 1 },
        { movieId: movie2._id, theatreId: theatre._id, showTime: time2, ticketPrice: 280, hallNumber: 2 },
        { movieId: movie2._id, theatreId: theatre._id, showTime: time4, ticketPrice: 350, hallNumber: 2 }
      );
    }
  }

  const createdShows = await Show.insertMany(shows);
  console.log(`Created ${createdShows.length} shows. Generating seat layouts...`);
  for (const s of createdShows) {
    await generateSeatsForShow(s._id);
  }

  console.log('Seeding demo bookings...');
  const demoShow = createdShows[0];
  const seatsToBook = ['A4', 'A5', 'B6'];

  await Seat.updateMany(
    { showId: demoShow._id, seatNumber: { $in: seatsToBook } },
    { $set: { isBooked: true, bookedBy: user1._id } }
  );

  const bookingTotal = Math.round(demoShow.ticketPrice * 1.3 * 2 + demoShow.ticketPrice * 1.3);
  const demoBooking = await Booking.create({
    userId: user1._id,
    showId: demoShow._id,
    seatsReserved: seatsToBook,
    totalAmount: bookingTotal,
    bookingStatus: 'CONFIRMED',
  });

  const demoPayment = await Payment.create({
    bookingId: demoBooking._id,
    amount: bookingTotal,
    paymentMethod: 'Credit Card',
    paymentStatus: 'COMPLETED',
    transactionId: `TXN-SEED-${Date.now()}`,
  });

  demoBooking.paymentId = demoPayment._id;
  await demoBooking.save();

  console.log('Initial Database Seed completed successfully!');
};

// Standalone execution handler
if (require.main === module) {
  const runStandalone = async () => {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies_db';
      console.log(`Connecting to MongoDB at: ${mongoUri}`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      await seedDataInternal();
      console.log('Standalone seed finished.');
      process.exit(0);
    } catch (err) {
      console.error('Seed Error:', err.message);
      process.exit(1);
    }
  };
  runStandalone();
}

module.exports = { seedDataInternal };
