import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;

  // allow correct dashboard access only
  if (user.role === "patient" && !path.startsWith("/patient-dashboard")) {
    return <Navigate to="/patient-dashboard" replace />;
  }

  if (user.role === "doctor" && !path.startsWith("/doctor-dashboard")) {
    return <Navigate to="/doctor-dashboard" replace />;
  }

  if (user.role === "admin" && !path.startsWith("/admin-dashboard")) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;