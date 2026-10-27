import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="badge bg-danger p-2.5 rounded-3 mb-2">
                <i className="bi bi-film fs-4"></i>
              </span>
              <h3 className="fw-extrabold text-white">Welcome Back</h3>
              <p className="text-muted small">Sign in to book tickets and manage reservations</p>
            </div>

            {/* Quick Fill Demo Credentials for College Viva / Testing */}
            <div className="bg-dark p-3 rounded-3 mb-4 border border-secondary border-opacity-50">
              <div className="text-muted small fw-bold mb-2">
                <i className="bi bi-key-fill text-warning me-1"></i> Quick Demo Logins:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@imovies.com', 'admin123')}
                  className="btn btn-sm btn-outline-warning flex-fill"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('user@imovies.com', 'user123')}
                  className="btn btn-sm btn-outline-info flex-fill"
                >
                  User Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-muted">
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-muted small mt-3">
              Don't have an account?{' '}
              <Link to="/register" className="text-danger fw-bold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
