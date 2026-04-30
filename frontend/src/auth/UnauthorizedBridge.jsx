import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUnauthorizedHandler } from "../api/api";
import { AuthContext } from "./AuthContext";

/**
 * Registers the axios 401 handler so rejected tokens redirect to login with a session notice.
 */
export default function UnauthorizedBridge() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
      navigate("/", { replace: true, state: { sessionExpired: true } });
    });
    return () => registerUnauthorizedHandler(() => {});
  }, [logout, navigate]);

  return null;
}
