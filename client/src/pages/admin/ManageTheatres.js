import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [totalHalls, setTotalHalls] = useState('4');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/theatres');
      setTheatres(res.data);
    } catch (err) {
      console.error('Error fetching theatres:', err);
      toast.error('Could not load theatres');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheatre = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name,
        location,
        city,
        totalHalls: Number(totalHalls),
        phone,
      };

      const res = await axiosInstance.post('/theatres', payload);
      toast.success(`Theatre "${res.data.name}" added successfully`);
      setTheatres([...theatres, res.data]);

      // Reset
      setName('');
      setLocation('');
      setCity('');
      setPhone('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding theatre:', err);
      toast.error(err.response?.data?.message || 'Failed to add theatre');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTheatre = async (theatreId, theatreName) => {
    if (!window.confirm(`Delete "${theatreName}"? Any associated shows and seats will be removed.`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/theatres/${theatreId}`);
      toast.success(`Theatre "${theatreName}" deleted successfully`);
      setTheatres(theatres.filter((t) => t._id !== theatreId));
    } catch (err) {
      console.error('Error deleting theatre:', err);
      toast.error(err.response?.data?.message || 'Failed to delete theatre');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-white mb-1">Theatre Complexes Management</h2>
          <p className="text-muted small mb-0">Register partner multiplexes and manage auditorium capabilities</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-brand d-flex align-items-center gap-2"
        >
          <i className={`bi ${showAddForm ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
          <span>{showAddForm ? 'Close Form' : 'Add New Theatre'}</span>
        </button>
      </div>

      {/* Add Theatre Form */}
      {showAddForm && (
        <div className="glass-card p-4 mb-4 border border-info border-opacity-50">
          <h4 className="fw-bold text-white mb-3">Register New Theatre</h4>
          <form onSubmit={handleAddTheatre} className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Theatre / Multiplex Name *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. INOX Megaplex"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">City *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. Mumbai, New York"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Street Address / Landmark *</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="e.g. Phoenix Marketcity, Kurla"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Total Screens / Halls</label>
              <input
                type="number"
                min={1}
                className="form-control bg-dark text-light border-secondary"
                required
                value={totalHalls}
                onChange={(e) => setTotalHalls(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Contact Phone</label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="+91 22 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-brand">
                {submitting ? 'Registering...' : 'Register Theatre'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Theatres Table */}
      <div className="glass-card p-4 overflow-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger" role="status"></div>
          </div>
        ) : theatres.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">No theatres found. Register a new theatre above.</p>
        ) : (
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr className="border-secondary text-muted small text-uppercase">
                <th>Theatre Name</th>
                <th>Location</th>
                <th>City</th>
                <th>Screens</th>
                <th>Contact</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {theatres.map((t) => (
                <tr key={t._id} className="border-secondary border-opacity-50">
                  <td className="fw-bold text-light">
                    <i className="bi bi-building text-info me-2"></i>
                    {t.name}
                  </td>
                  <td className="text-muted small">{t.location}</td>
                  <td>
                    <span className="badge bg-secondary">{t.city}</span>
                  </td>
                  <td>{t.totalHalls} Auditoriums</td>
                  <td className="text-muted small">{t.phone || 'N/A'}</td>
                  <td className="text-end">
                    <button
                      onClick={() => handleDeleteTheatre(t._id, t.name)}
                      className="btn btn-sm btn-outline-danger"
                      title="Delete Theatre"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageTheatres;
