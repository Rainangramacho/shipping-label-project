import { Navigate, useLocation } from "react-router-dom";

/**
 * Redirects to login when no auth token is present.
 * Preserves session-expired messaging via router state.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ sessionExpired: true, from: location }}
      />
    );
  }

  return children;
}
