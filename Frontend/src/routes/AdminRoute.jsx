import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import paths from "./paths";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loading size="large" fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={paths.user.polls} replace />;
  }

  return <Outlet />;
}