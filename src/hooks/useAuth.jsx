import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../Utils/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If route is admin-only, check user role
  if (adminOnly) {
    const user = getUser(); // should return { username, role, allowedReaders }
    if (user?.role !== "admin") {
      return <Navigate to="/" replace />; // redirect non-admins to home
    }
  }

  return children;
};

export default ProtectedRoute;

// -----------------------------PUBLIC ROUTE---------------------------

export const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};
