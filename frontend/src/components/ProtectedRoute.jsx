import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Cargando sesión...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const allowedRoles = Array.isArray(roles) ? roles : roles ? [roles] : null;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
