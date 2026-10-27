import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark border-top border-secondary border-opacity-25 mt-auto py-4">
      <div className="container text-center text-md-start">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="fw-bold text-white mb-1">
              <span className="text-danger">I</span>Movies
            </h5>
            <p className="text-muted small mb-0">
              Movie Ticket Booking Made Simple &bull; Full-Stack MERN Architecture
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50 py-2 px-3 rounded-pill small">
              College Capstone Project &bull; Socket.io Real-Time Enabled
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
