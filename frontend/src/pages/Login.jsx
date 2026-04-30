import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/AuthForm.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionExpiredBanner, setSessionExpiredBanner] = useState(false);

  useEffect(() => {
    if (!location.state?.sessionExpired) return;
    setSessionExpiredBanner(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!sessionExpiredBanner) return;
    const id = window.setTimeout(() => setSessionExpiredBanner(false), 10000);
    return () => window.clearTimeout(id);
  }, [sessionExpiredBanner]);

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
    window.location.href = "/dashboard";
  }

  return (
    <div className="login-page">
      {sessionExpiredBanner ? (
        <div className="login-session-alert" role="alert">
          <span className="login-session-alert-text">
            Your session has expired. Please sign in again.
          </span>
          <button
            type="button"
            className="login-session-alert-dismiss"
            onClick={() => setSessionExpiredBanner(false)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ) : null}

      <div className="login-card">
        <header>
          <h2>Login</h2>
          <p className="login-lede">Sign in to manage your shipments.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-form-actions">
            <button className="login-submit" type="submit">
              Sign in
            </button>
          </div>
        </form>

        <p className="login-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
