import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password, role);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="glass-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="badge bg-danger p-2.5 rounded-3 mb-2">
                <i className="bi bi-person-plus fs-4"></i>
              </span>
              <h3 className="fw-extrabold text-white">Create Account</h3>
              <p className="text-muted small">Join IMovies for effortless movie ticket booking</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. Alex Johnson"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="At least 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Repeat password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Account Role</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Standard User (Customer)</option>
                  <option value="admin">Theatre Administrator</option>
                </select>
                <div className="form-text text-muted small">
                  Select "Theatre Administrator" to test Admin features directly.
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-brand w-100 py-2.5 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
              >
                {submitting ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <>
                    <i className="bi bi-check2-circle"></i>
                    <span>Register Now</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-muted small mt-3">
              Already have an account?{' '}
              <Link to="/login" className="text-danger fw-bold text-decoration-none">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
