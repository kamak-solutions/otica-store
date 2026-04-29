import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth/use-auth";

export function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
