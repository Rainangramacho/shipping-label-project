import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/api";
import "../styles/Dashboard.css";

function formatLabelCreatedAt(value) {
  if (value == null || value === "") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (!location.state?.labelCreated) return;
    setSuccessToast(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!successToast) return;
    const id = window.setTimeout(() => setSuccessToast(false), 6000);
    return () => window.clearTimeout(id);
  }, [successToast]);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/shipping-labels")
      .then((res) => {
        if (!cancelled) setLabels(res.data);
      })
      .catch(() => {
        if (!cancelled) setLabels([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="dashboard">
      {successToast ? (
        <div className="dashboard-toast" role="status" aria-live="polite">
          <span className="dashboard-toast-text">
            Label created successfully.
          </span>
          <button
            type="button"
            className="dashboard-toast-close"
            onClick={() => setSuccessToast(false)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ) : null}

      <header className="dashboard-header">
        <div className="dashboard-title-block">
          <h1>My labels</h1>
          <p className="dashboard-lede">
            Tracking codes and printable labels for your shipments.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link className="dashboard-btn dashboard-btn--primary" to="/create">
            New label
          </Link>
          <button
            type="button"
            className="dashboard-btn dashboard-btn--ghost"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      {loading ? (
        <p className="dashboard-loading">Loading labels…</p>
      ) : labels.length === 0 ? (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon" aria-hidden />
          <h2>No labels yet</h2>
          <p>
            Create your first shipping label to see it listed here with a
            tracking code.
          </p>
          <Link className="dashboard-btn dashboard-btn--primary" to="/create">
            Create label
          </Link>
        </div>
      ) : (
        <ul className="dashboard-list">
          {labels.map((label) => (
            <li key={label.id}>
              <article className="dashboard-card">
                <div className="dashboard-card-main">
                  <div className="dashboard-card-block">
                    <span className="dashboard-card-label">Tracking</span>
                    <p className="dashboard-card-code">
                      {label.easypost_id ?? "—"}
                    </p>
                  </div>
                  <div className="dashboard-card-block">
                    <span className="dashboard-card-label">Created</span>
                    <time
                      className="dashboard-card-date"
                      dateTime={
                        label.created_at &&
                        !Number.isNaN(new Date(label.created_at).getTime())
                          ? new Date(label.created_at).toISOString()
                          : undefined
                      }
                    >
                      {formatLabelCreatedAt(label.created_at)}
                    </time>
                  </div>
                </div>
                <button className="dashboard-card-link" onClick={() => navigate(`/label/${label.id}`)}>
                    View label
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
