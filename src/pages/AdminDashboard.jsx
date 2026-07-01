import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const STATUS_OPTIONS = ['PENDING', 'ASSIGNED', 'EN_ROUTE', 'DELIVERED'];

const STATUS_COLORS = {
  PENDING: 'status-pending',
  ASSIGNED: 'status-assigned',
  EN_ROUTE: 'status-enroute',
  DELIVERED: 'status-delivered',
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load requests');
      setRequests(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const assignPartner = async (id) => {
    if (!partnerName || !partnerPhone) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/requests/${id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: partnerName, phone: partnerPhone }),
      });
      setSelected(null);
      setPartnerName('');
      setPartnerPhone('');
      fetchRequests();
    } catch (err) {
      setError('Failed to assign partner');
    }
  };

  const filteredRequests =
    filter === 'ALL' ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === 'PENDING').length,
    ASSIGNED: requests.filter((r) => r.status === 'ASSIGNED').length,
    EN_ROUTE: requests.filter((r) => r.status === 'EN_ROUTE').length,
    DELIVERED: requests.filter((r) => r.status === 'DELIVERED').length,
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage all incoming fuel requests</p>
        </div>
        <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/auth'); }}>
          Logout
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-num">{counts.ALL}</span>
          <span className="admin-stat-label">Total Requests</span>
        </div>
        <div className="admin-stat-card pending">
          <span className="admin-stat-num">{counts.PENDING}</span>
          <span className="admin-stat-label">Pending</span>
        </div>
        <div className="admin-stat-card assigned">
          <span className="admin-stat-num">{counts.ASSIGNED}</span>
          <span className="admin-stat-label">Assigned</span>
        </div>
        <div className="admin-stat-card enroute">
          <span className="admin-stat-num">{counts.EN_ROUTE}</span>
          <span className="admin-stat-label">En Route</span>
        </div>
        <div className="admin-stat-card delivered">
          <span className="admin-stat-num">{counts.DELIVERED}</span>
          <span className="admin-stat-label">Delivered</span>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        {['ALL', ...STATUS_OPTIONS].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
        <button className="refresh-btn" onClick={fetchRequests}>🔄 Refresh</button>
      </div>

      {/* CONTENT */}
      {loading && <div className="admin-loading">Loading requests...</div>}

      {!loading && error && (
        <div className="admin-error">⚠️ {error}</div>
      )}

      {!loading && !error && filteredRequests.length === 0 && (
        <div className="admin-empty">No requests in this category.</div>
      )}

      {!loading && !error && filteredRequests.length > 0 && (
        <div className="requests-table">
          <div className="table-header">
            <span>ID</span>
            <span>Customer</span>
            <span>Fuel</span>
            <span>Qty</span>
            <span>Location</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredRequests.map((req) => (
            <div key={req.id} className="table-row">
              <span className="cell-id">#{req.id}</span>
              <span>{req.customerName || 'N/A'}</span>
              <span>{req.fuelType === 'PETROL' ? '⛽ Petrol' : '🛢️ Diesel'}</span>
              <span>{req.quantity}L</span>
              <span className="cell-location">{req.location}</span>
              <span>
                {req.isEmergency ? (
                  <span className="emergency-pill">🚨 Emergency</span>
                ) : (
                  <span className="standard-pill">Standard</span>
                )}
              </span>
              <span>
                <span className={`status-pill ${STATUS_COLORS[req.status]}`}>
                  {req.status.replace('_', ' ')}
                </span>
              </span>
              <span className="cell-actions">
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                  className="status-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                {!req.deliveryPartner && (
                  <button className="assign-btn" onClick={() => setSelected(req.id)}>
                    Assign
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ASSIGN MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Delivery Partner</h3>
            <p className="modal-sub">For request #{selected}</p>

            <input
              type="text"
              placeholder="Partner name"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Partner phone"
              value={partnerPhone}
              onChange={(e) => setPartnerPhone(e.target.value)}
              className="modal-input"
            />

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setSelected(null)}>Cancel</button>
              <button className="modal-confirm" onClick={() => assignPartner(selected)}>Assign</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
