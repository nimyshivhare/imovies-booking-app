const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const seatRoutes = require('./routes/seatRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Pass socket.io instance to Express controllers via app
app.set('socketio', io);

// Socket.io Real-time Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket Connected]: ${socket.id}`);

  // User joins a show's seat selection room
  socket.on('joinShow', (showId) => {
    socket.join(`show_${showId}`);
    console.log(`[Socket ${socket.id}] joined room show_${showId}`);
  });

  // User leaves show room
  socket.on('leaveShow', (showId) => {
    socket.leave(`show_${showId}`);
    console.log(`[Socket ${socket.id}] left room show_${showId}`);
  });

  // Client notifies others of temporary seat selection
  socket.on('seatSelected', ({ showId, seatNumber, userId }) => {
    socket.to(`show_${showId}`).emit('seatSelected', { seatNumber, userId });
  });

  // Client deselects
  socket.on('seatDeselected', ({ showId, seatNumber }) => {
    socket.to(`show_${showId}`).emit('seatDeselected', { seatNumber });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected]: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'IMovies - Movie Ticket Booking Made Simple',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[IMovies Server running]: Port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
