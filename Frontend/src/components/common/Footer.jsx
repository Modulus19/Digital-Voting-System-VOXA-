import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../../assets/images/logo.png";
import paths from "../../routes/paths";

const Footer = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <footer className="border-t border-[#E8E8EC] bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Logo & Description */}
          <div className="max-w-xs">
            <Link to={paths.home} className="inline-flex">
              <img
                src={logo}
                alt="Voxa"
                className="h-10 w-auto"
              />
            </Link>

            <p className="mt-3 text-sm leading-5 text-[#0F172A]">
              Create polls, share your opinion, and discover what people
              really think.
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#0F172A] transition hover:border-[#3B82F6] hover:text-[#3B82F6]"
              >
                <Icon icon="mdi:twitter" width="16" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#0F172A] transition hover:border-[#3B82F6] hover:text-[#3B82F6]"
              >
                <Icon icon="mdi:instagram" width="16" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#0F172A] transition hover:border-[#3B82F6] hover:text-[#3B82F6]"
              >
                <Icon icon="mdi:linkedin" width="16" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16">

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Product
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to={paths.home}
                  className={`text-sm font-medium transition ${
                    isActive(paths.home)
                      ? "text-[#3B82F6]"
                      : "text-[#8C8C94] hover:text-[#3B82F6]"
                  }`}
                >
                  Home
                </Link>

                <Link
                  to={paths.user.polls}
                  className={`text-sm font-medium transition ${
                    isActive(paths.user.polls)
                      ? "text-[#3B82F6]"
                      : "text-[#0F172A] hover:text-[#3B82F6]"
                  }`}
                >
                  Polls
                </Link>

                <Link
                  to={paths.about}
                  className={`text-sm font-medium transition ${
                    isActive(paths.about)
                      ? "text-[#3B82F6]"
                      : "text-[#0F172A] hover:text-[#3B82F6]"
                  }`}
                >
                  About
                </Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Account
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to={paths.auth.login}
                  className="text-sm font-medium text-[#80F172A] transition hover:text-[#3B82F6]"
                >
                  Log In
                </Link>

                <Link
                  to={paths.auth.register}
                  className="text-sm font-medium text-[#0F172A] transition hover:text-[#3B82F6]"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Support
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <a
                  href="#"
                  className="text-sm font-medium text-[#0F172A] transition hover:text-[#3B82F6]"
                >
                  Help Center
                </a>

                <a
                  href="#"
                  className="text-sm font-medium text-[#0F172A] transition hover:text-[#3B82F6]"
                >
                  Contact Us
                </a>

                <a
                  href="#"
                  className="text-sm font-medium text-[#0F172A] transition hover:text-[#3B82F6]"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-7 flex flex-col gap-2 border-t border-gray-200 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-[#8C8C94]">
            © {new Date().getFullYear()} Voxa. All rights reserved.
          </p>

          <p className="text-xs text-[#8C8C94]">
            Make your voice count.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;