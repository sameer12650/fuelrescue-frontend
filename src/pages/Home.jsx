import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo">🔥 FuelRescue</div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <button className="nav-btn" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">⚡ Emergency Fuel Delivery</div>
        <h1 className="hero-title">
          Stranded on the<br />
          <span className="hero-accent">highway?</span><br />
          We come to you.
        </h1>
        <p className="hero-sub">
          Book fuel delivery in seconds. Even with no internet — just send an SMS.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => navigate('/auth')}>Request Fuel Now</button>
          <a href="#how" className="btn-ghost">See how it works</a>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <span className="stat-num">45 min</span>
            <span className="stat-label">Average delivery</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">24/7</span>
            <span className="stat-label">Always available</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">SMS</span>
            <span className="stat-label">Works offline</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <p className="section-eyebrow">Simple process</p>
        <h2 className="section-title">Fuel in 3 steps</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">📍</div>
            <h3>Share your location</h3>
            <p>Open the app or send SMS with your location. GPS auto-detects if you're online.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-icon">⛽</div>
            <h3>Choose fuel & quantity</h3>
            <p>Select petrol or diesel and how many litres you need. We confirm availability instantly.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-icon">🚚</div>
            <h3>We deliver</h3>
            <p>A licensed delivery partner heads to you. Track live on the map until arrival.</p>
          </div>
        </div>
      </section>

      {/* SMS SECTION */}
      <section className="sms-section">
        <div className="sms-content">
          <p className="section-eyebrow">No internet? No problem.</p>
          <h2 className="section-title">Book via SMS from anywhere</h2>
          <p className="sms-desc">
            Deep in a highway with no data? Just send a text. Our system reads your SMS,
            finds your account, and dispatches a delivery partner — no app needed.
          </p>
          <div className="sms-format">
            <span className="sms-label">Send this to +91-XXXXX-XXXXX</span>
            <div className="sms-bubble">SOS PETROL 5</div>
            <span className="sms-hint">Format: SOS [FUEL TYPE] [LITRES]</span>
          </div>
        </div>
        <div className="sms-phone">
          <div className="phone-screen">
            <div className="phone-msg sent">SOS PETROL 5</div>
            <div className="phone-msg received">✅ Request received! Delivery partner assigned. ETA: 38 mins. Track: fuelrescue.in/track/4821</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-eyebrow">Why FuelRescue</p>
        <h2 className="section-title">Built for real emergencies</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">📡</span>
            <h3>Works offline via SMS</h3>
            <p>No data connection required. Just a basic text message is all you need.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🗺️</span>
            <h3>Live GPS tracking</h3>
            <p>Watch your delivery partner move toward you in real time on the map.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Emergency priority</h3>
            <p>Mark your request as emergency and jump the queue for faster dispatch.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🏪</span>
            <h3>Licensed stations only</h3>
            <p>All fuel sourced from verified, licensed petrol stations near you.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔔</span>
            <h3>Real-time updates</h3>
            <p>Get SMS and app notifications at every step of your delivery.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🛡️</span>
            <h3>Secure payments</h3>
            <p>Pay online or cash on delivery. All transactions are encrypted.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Don't wait until you're stranded.</h2>
        <p>Create a free account now. It takes 30 seconds.</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/auth')}>Create free account →</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span>🔥 FuelRescue</span>
        <span>© 2025 · Emergency Fuel Delivery Platform</span>
      </footer>

    </div>
  );
}
