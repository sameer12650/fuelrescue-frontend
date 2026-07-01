import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/book.css';

export default function BookFuel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fuelType: 'PETROL',
    quantity: 5,
    vehicleType: 'CAR',
    location: '',
    latitude: '',
    longitude: '',
    isEmergency: false,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locStatus, setLocStatus] = useState('idle'); // idle | asking | granted | denied

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      setLocStatus('denied');
      return;
    }
    setLocLoading(true);
    setLocStatus('asking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
          location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
        setLocLoading(false);
        setLocStatus('granted');
      },
      () => {
        setError('Location permission denied. Please enter your location manually.');
        setLocLoading(false);
        setLocStatus('denied');
      }
    );
  };

  // Ask for location permission automatically as soon as the page opens
  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!form.location) { setError('Please enter or detect your location.'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/fuel/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      navigate(`/track/${data.requestId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-page">

      {/* HEADER */}
      <div className="book-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="book-header-title">
          <h1>Book Fuel Delivery</h1>
          <p>Fill in the details and we'll dispatch a delivery partner to you.</p>
        </div>
      </div>

      <div className="book-layout">

        {/* FORM */}
        <div className="book-form">

          {/* FUEL TYPE */}
          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <div className="toggle-group">
              {['PETROL', 'DIESEL'].map((type) => (
                <button
                  key={type}
                  className={`toggle-btn ${form.fuelType === type ? 'active' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, fuelType: type }))}
                >
                  {type === 'PETROL' ? '⛽ Petrol' : '🛢️ Diesel'}
                </button>
              ))}
            </div>
          </div>

          {/* VEHICLE TYPE */}
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <div className="toggle-group">
              {[
                { value: 'CAR', label: '🚗 Car' },
                { value: 'BIKE', label: '🏍️ Bike' },
                { value: 'TRUCK', label: '🚛 Truck' },
              ].map((v) => (
                <button
                  key={v.value}
                  className={`toggle-btn ${form.vehicleType === v.value ? 'active' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, vehicleType: v.value }))}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="form-group">
            <label className="form-label">
              Quantity — <span className="quantity-display">{form.quantity} litres</span>
            </label>
            <input
              type="range"
              name="quantity"
              min="1"
              max="20"
              value={form.quantity}
              onChange={handleChange}
              className="range-input"
            />
            <div className="range-labels">
              <span>1L</span>
              <span>5L</span>
              <span>10L</span>
              <span>15L</span>
              <span>20L</span>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <label className="form-label">Your Location</label>

            {locStatus === 'asking' && (
              <p className="loc-status loc-asking">📡 Asking for location permission...</p>
            )}
            {locStatus === 'granted' && (
              <p className="loc-status loc-granted">✅ Location detected automatically</p>
            )}
            {locStatus === 'denied' && (
              <p className="loc-status loc-denied">⚠️ Permission denied — please allow location access or enter manually</p>
            )}

            <div className="location-row">
              <input
                type="text"
                name="location"
                placeholder="Enter landmark or address..."
                value={form.location}
                onChange={handleChange}
                className="form-input"
              />
              <button className="detect-btn" onClick={detectLocation} disabled={locLoading}>
                {locLoading ? '...' : '📍 Detect'}
              </button>
            </div>
            {form.latitude && (
              <p className="coord-hint">📌 GPS: {form.latitude}, {form.longitude}</p>
            )}
          </div>

          {/* NOTES */}
          <div className="form-group">
            <label className="form-label">Additional Notes <span className="optional">(optional)</span></label>
            <textarea
              name="notes"
              placeholder="E.g. I'm near the highway milestone 42, white Hyundai..."
              value={form.notes}
              onChange={handleChange}
              className="form-input form-textarea"
              rows={3}
            />
          </div>

          {/* EMERGENCY TOGGLE */}
          <div className="emergency-row">
            <div className="emergency-text">
              <span className="emergency-title">🚨 Emergency Request</span>
              <span className="emergency-desc">Mark as emergency to get priority dispatch</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="isEmergency"
                checked={form.isEmergency}
                onChange={handleChange}
              />
              <span className="slider" />
            </label>
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}

          {/* SUBMIT */}
          <button
            className={`submit-btn ${form.isEmergency ? 'emergency' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Booking...' : form.isEmergency ? '🚨 Request Emergency Fuel' : '⛽ Request Fuel Delivery'}
          </button>

        </div>

        {/* SUMMARY CARD */}
        <div className="book-summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Fuel type</span>
              <span>{form.fuelType === 'PETROL' ? '⛽ Petrol' : '🛢️ Diesel'}</span>
            </div>
            <div className="summary-row">
              <span>Vehicle</span>
              <span>{form.vehicleType}</span>
            </div>
            <div className="summary-row">
              <span>Quantity</span>
              <span>{form.quantity} litres</span>
            </div>
            <div className="summary-row">
              <span>Priority</span>
              <span className={form.isEmergency ? 'emergency-tag' : 'normal-tag'}>
                {form.isEmergency ? '🚨 Emergency' : 'Standard'}
              </span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-eta">
            <span>Estimated arrival</span>
            <span className="eta-time">{form.isEmergency ? '~25 min' : '~45 min'}</span>
          </div>

          <div className="summary-note">
            💡 No internet later? Send <strong>SOS {form.fuelType} {form.quantity}</strong> via SMS to reach us offline.
          </div>
        </div>

      </div>
    </div>
  );
}
