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
    <nav className="w-full border-b border-gray-100 bg-white">
      {/* Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to={paths.home}
          onClick={closeMenu}
          className="flex shrink-0 items-center"
        >
          <img
            src={logo}
            alt="Voxa"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">

          <Link
            to={paths.home}
            className={`text-sm font-semibold transition ${
              isActive("/")
                ? "text-[#3B82F6]"
                : "text-slate-500 hover:text-[#3B82F6]"
            }`}
          >
            Home
          </Link>

          <Link
            to={paths.about}
            className={`text-sm font-semibold transition ${
              isActive("/about")
                ? "text-[#3B82F6]"
                : "text-slate-500 hover:text-[#3B82F6]"
            }`}
          >
            About
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to={paths.user.polls}
                className={`text-sm font-semibold transition ${
                  isActive("/polls")
                    ? "text-[#3B82F6]"
                    : "text-slate-500 hover:text-[#3B82F6]"
                }`}
              >
                Polls
              </Link>

              <Link
                to={paths.user.myVotes}
                className={`text-sm font-semibold transition ${
                  isActive("/my-votes")
                    ? "text-[#3B82F6]"
                    : "text-slate-500 hover:text-[#3B82F6]"
                }`}
              >
                My Votes
              </Link>
            </>
          )}

          {/* User / Auth Buttons */}
          {isAuthenticated ? (
            <Link
              to={paths.user.profile}
              className="ml-1"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
                {initials}
              </div>
            </Link>
          ) : (
            <div className="ml-1 flex items-center gap-3">

              <Link
                to={paths.auth.login}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#3B82F6] hover:text-[#3B82F6]"
              >
                Log In
              </Link>

              <Link
                to={paths.auth.register}
                className="rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
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
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-gray-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <Icon
            icon={menuOpen ? "mdi:close" : "mdi:menu"}
            width="25"
          />
        </button>

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            <div className="flex flex-col gap-1">

              {/* Home */}
              <Link
                to={paths.home}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive("/")
                    ? "bg-blue-50 text-[#3B82F6]"
                    : "text-slate-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>

              {/* About */}
              <Link
                to={paths.about}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive("/about")
                    ? "bg-blue-50 text-[#3B82F6]"
                    : "text-slate-600 hover:bg-gray-50"
                }`}
              >
                About
              </Link>

              {/* Authenticated Links */}
              {isAuthenticated && (
                <>
                  <Link
                    to={paths.user.polls}
                    onClick={closeMenu}
                    className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      isActive("/polls")
                        ? "bg-blue-50 text-[#3B82F6]"
                        : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    Polls
                  </Link>

                  <Link
                    to={paths.user.myVotes}
                    onClick={closeMenu}
                    className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      isActive("/my-votes")
                        ? "bg-blue-50 text-[#3B82F6]"
                        : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    My Votes
                  </Link>

                  {/* Profile */}
                  <Link
                    to={paths.user.profile}
                    onClick={closeMenu}
                    className="mt-2 flex items-center gap-3 border-t border-gray-100 px-3 pt-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
                      {initials}
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      Profile
                    </span>
                  </Link>
                </>
              )}

              {/* Logged Out */}
              {!isAuthenticated && (
                <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-4">

                  <Link
                    to={paths.auth.login}
                    onClick={closeMenu}
                    className="w-full rounded-lg border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-[#0F172A] transition hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  >
                    Log In
                  </Link>

                  <Link
                    to={paths.auth.register}
                    onClick={closeMenu}
                    className="w-full rounded-lg bg-[#3B82F6] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    Sign Up
                  </Link>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}