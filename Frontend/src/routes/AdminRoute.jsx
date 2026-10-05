import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import paths from "./paths";

export default function AdminRoute() {
  console.log("ADMIN ROUTE IS RUNNING");
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loading size="large" fullScreen />;

 if (!isAdmin) {
  console.log("ADMIN CHECK:", {
    isAuthenticated,
    isAdmin,
  });

  return <Navigate to={paths.user.polls} replace />;
}
  return <Outlet />;
}