import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import paths from "./paths";
import NotFound from "../pages/NotFound";

// Public pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Verification from "../pages/auth/Verification";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyResetOTP from "../pages/auth/VerifyResetOTP";

// User pages
import Polls from "../pages/user/Polls";
import PollDetails from "../pages/user/PollDetails";
import CreatePoll from "../pages/user/CreatePoll";
import EditPoll from "../pages/user/EditPoll";
import MyPolls from "../pages/user/MyPolls";
import Drafts from "../pages/user/Drafts";
import MyVotes from "../pages/user/MyVotes";
import Profile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import AllPolls from "../pages/admin/AllPolls";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminPollDetails from "../pages/admin/PollDetails";
import AdminEditPoll from "../pages/admin/AdminEditPoll";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/verification"
          element={<Verification />}
        />
        <Route
          path="/verify-reset-otp"
          element={<VerifyResetOTP />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
      </Route>

      {/* User Routes — protected, must be logged in */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/polls" element={<Polls />} />
          <Route
            path="/polls/:id"
            element={<PollDetails />}
          />
          <Route
            path="/polls/create"
            element={<CreatePoll />}
          />
          <Route
            path="/polls/:id/edit"
            element={<EditPoll />}
          />
          <Route
            path="/my-polls"
            element={<MyPolls />}
          />
          <Route path="/drafts" element={<Drafts />} />
          <Route
            path="/my-votes"
            element={<MyVotes />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/profile/edit"
            element={<EditProfile />}
          />
        </Route>
      </Route>

      {/* Admin Routes — protected and admin-only */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Dashboard />}
          />

          <Route
            path="/admin/polls"
            element={<AllPolls />}
          />

          <Route
            path="/admin/polls/:id"
            element={<AdminPollDetails />}
          />

          <Route
            path="/admin/polls/:id/edit"
            element={<AdminEditPoll />}
          />

          <Route
            path="/admin/users"
            element={<ManageUsers />}
          />

        </Route>
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;