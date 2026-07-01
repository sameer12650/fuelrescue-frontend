import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/track.css';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Request Received', icon: '📝' },
  { key: 'ASSIGNED', label: 'Partner Assigned', icon: '🧑‍🔧' },
  { key: 'EN_ROUTE', label: 'On The Way', icon: '🚚' },
  { key: 'DELIVERED', label: 'Delivered', icon: '✅' },
];

export default function TrackRequest() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/fuel/track/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not fetch request');
      setRequest(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
    const interval = setInterval(fetchRequest, 10000); // poll every 10s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const currentStepIndex = request
    ? STATUS_STEPS.findIndex((s) => s.key === request.status)
    : -1;

  return (
    <div className="track-page">

      <div className="track-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="track-header-title">
          <h1>Track Your Delivery</h1>
          <p>Request ID: #{id}</p>
        </div>
      </div>

      {loading && (
        <div className="track-loading">
          <div className="spinner" />
          <p>Loading your request...</p>
        </div>
      )}

      {!loading && error && (
        <div className="track-error">
          <p>⚠️ {error}</p>
          <button className="retry-btn" onClick={fetchRequest}>Retry</button>
        </div>
      )}

      {!loading && !error && request && (
        <div className="track-layout">

          {/* TIMELINE */}
          <div className="track-timeline-card">

            {request.isEmergency && (
              <div className="emergency-banner">🚨 Emergency Priority Request</div>
            )}

            <div className="timeline">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                return (
                  <div key={step.key} className="timeline-item">
                    <div className="timeline-marker-col">
                      <div className={`timeline-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                        {isDone ? '✓' : step.icon}
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`timeline-line ${isDone ? 'done' : ''}`} />
                      )}
                    </div>
                    <div className="timeline-content">
                      <span className={`timeline-label ${isActive ? 'active' : ''}`}>{step.label}</span>
                      {isActive && <span className="timeline-now">In progress now</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {request.status === 'DELIVERED' && (
              <div className="delivered-msg">🎉 Fuel delivered successfully! Thank you for using FuelRescue.</div>
            )}
          </div>

          {/* DETAILS CARD */}
          <div className="track-details-card">
            <h3 className="details-title">Order Details</h3>

            <div className="detail-row">
              <span>Fuel type</span>
              <span>{request.fuelType === 'PETROL' ? '⛽ Petrol' : '🛢️ Diesel'}</span>
            </div>
            <div className="detail-row">
              <span>Quantity</span>
              <span>{request.quantity} litres</span>
            </div>
            <div className="detail-row">
              <span>Vehicle</span>
              <span>{request.vehicleType}</span>
            </div>
            <div className="detail-row">
              <span>Location</span>
              <span className="location-text">{request.location}</span>
            </div>

            <div className="details-divider" />

            {request.deliveryPartner ? (
              <div className="partner-box">
                <span className="partner-label">Delivery Partner</span>
                <span className="partner-name">👤 {request.deliveryPartner.name}</span>
                <span className="partner-phone">📞 {request.deliveryPartner.phone}</span>
              </div>
            ) : (
              <p className="waiting-text">Waiting for a delivery partner to be assigned...</p>
            )}

            <div className="details-divider" />

            <div className="eta-box">
              <span>Estimated arrival</span>
              <span className="eta-value">{request.eta || (request.isEmergency ? '~25 min' : '~45 min')}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
