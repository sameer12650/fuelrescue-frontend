import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      if (data.role === 'ADMIN') navigate('/admin');
      else navigate('/book');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  firstName: registerData.firstName,
  lastName: registerData.lastName,
  email: registerData.email,
  phone: registerData.phone,
  password: registerData.password,
}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setTab('login');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="logo">
          <div className="logo-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2c-4 6-4 10 0 12s4 6 0 10" />
            </svg>
          </div>
          FuelRescue
        </div>

        <div className="auth-left-body">
          <h2>Fuel rescue,<br />wherever you are.</h2>
          <p>
            Create an account to book emergency fuel delivery, track your
            request live, and activate SMS rescue for offline areas.
          </p>
          <div className="trust-items">
            {[
              'Fuel delivered in under 45 minutes',
              'Works offline via SMS — no internet needed',
              'Licensed petrol stations only',
              'Live GPS tracking on every order',
            ].map((item) => (
              <div className="trust-item" key={item}>
                <span className="trust-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-left-foot">© 2025 FuelRescue · Emergency Fuel Delivery</div>
      </div>

      <div className="auth-right">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Log in
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <div className="forgot">Forgot password?</div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            <div className="divider-or">or</div>
            <button type="button" className="btn-sms">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Continue with SMS OTP
            </button>
            <div className="switch-text">
              No account?{' '}
              <span onClick={() => setTab('register')}>Register here</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="row-2">
              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  placeholder="Sameer"
                  required
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  placeholder="Khan"
                  required
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                Phone number{' '}
                <span className="phone-note">(used for SMS rescue)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                required
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                minLength={8}
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <div className="switch-text">
              Already have an account?{' '}
              <span onClick={() => setTab('login')}>Log in</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
