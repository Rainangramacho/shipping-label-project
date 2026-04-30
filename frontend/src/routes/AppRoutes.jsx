import { BrowserRouter, Routes, Route } from "react-router-dom";
import UnauthorizedBridge from "../auth/UnauthorizedBridge";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateLabel from "../pages/CreateLabel";
import LabelDetails from "../pages/LabelDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <UnauthorizedBridge />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateLabel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/label/:id"
          element={
            <ProtectedRoute>
              <LabelDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}