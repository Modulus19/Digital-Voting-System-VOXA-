// src/components/common/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import paths from "../../routes/paths";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="h-20 flex items-center justify-between px-4 sm:px-8 lg:px-16">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <img src={logo} alt="Voxa" className="h-8" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5 lg:gap-8">
          <Link to={paths.home}
            className={`text-sm font-semibold ${
              isActive("/")
                ? "text-[#3B82F6]"
                : "text-slate-500"
            }`}
          >
            Home
          </Link>

          <Link to={paths.about}
            className={`text-sm font-semibold ${
              isActive("/about")
                ? "text-purple-500"
                : "text-slate-500"
            }`}
          >
            About
          </Link>

          {isAuthenticated && (
            <>
              <Link to={paths.user.polls}
                className={`text-sm font-semibold ${
                  isActive("/polls")
                    ? "text-purple-500"
                    : "text-slate-500"
                }`}
              >
                Polls
              </Link>

             <Link to={paths.user.myVotes}
                className={`text-sm font-semibold ${
                  isActive("/my-votes")
                    ? "text-purple-500"
                    : "text-slate-500"
                }`}
              >
                My Votes
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <Link to={paths.user.profile}>
              <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={paths.auth.login}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-slate-900"
              >
                Log In
              </Link>

              <Link to={paths.auth.register}
                className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-700"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <Icon
            icon={menuOpen ? "mdi:close" : "mdi:menu"}
            width="28"
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-5">
          <div className="flex flex-col gap-4">

            <Link
              to="/"
              onClick={closeMenu}
              className={`text-sm font-semibold ${
                isActive(paths.home)
                  ? "text-[#3B82F6]"
                  : "text-slate-500"
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className={`text-sm font-semibold ${
                isActive(paths.about)
                  ? "text-purple-500"
                  : "text-slate-500"
              }`}
            >
              About
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/polls"
                  onClick={closeMenu}
                  className={`text-sm font-semibold ${
                    isActive(paths.user.polls)
                      ? "text-purple-500"
                      : "text-slate-500"
                  }`}
                >
                  Polls
                </Link>

                <Link
                  to="/my-votes"
                  onClick={closeMenu}
                  className={`text-sm font-semibold ${
                    isActive(paths.user.myVotes)
                      ? "text-purple-500"
                      : "text-slate-500"
                  }`}
                >
                  My Votes
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    Profile
                  </span>
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-slate-900"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}