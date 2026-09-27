// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import paths from "./paths";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading size="large" fullScreen />;
  if (!isAuthenticated) return <Navigate to={paths.auth.login} replace />;

  return <Outlet />;
}