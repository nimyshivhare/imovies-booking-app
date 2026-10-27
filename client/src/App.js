import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageTheatres from './pages/admin/ManageTheatres';
import ManageShows from './pages/admin/ManageShows';
import ManageBookings from './pages/admin/ManageBookings';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="app-container d-flex flex-column min-vh-100">
            <Navbar />
            <main className="main-content flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/show/:showId/seats" element={<SeatSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/confirmation/:bookingId"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Management Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/movies"
                  element={
                    <AdminRoute>
                      <ManageMovies />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/theatres"
                  element={
                    <AdminRoute>
                      <ManageTheatres />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/shows"
                  element={
                    <AdminRoute>
                      <ManageShows />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <ManageBookings />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
