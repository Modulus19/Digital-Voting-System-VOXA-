import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "mdi:view-dashboard-outline",
    },
    {
      label: "All Polls",
      path: "/admin/polls",
      icon: "mdi:poll",
    },
    {
      label: "Manage Users",
      path: "/admin/users",
      icon: "mdi:account-group-outline",
    },
  ];

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1554B8] text-white">
      {/* Logo */}
      <div className="flex h-20 items-center justify-between px-6">
        <NavLink to="/admin" onClick={onClose}>
          <span className="text-2xl font-bold tracking-tight">
            VOXA
          </span>
        </NavLink>

        {/* Close button (mobile only, because only the mobile sidebar gets onClose) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-100 transition hover:bg-white/10 hover:text-white"
            aria-label="Close admin menu"
          >
            <Icon icon="mdi:close" width="22" height="22" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon icon={item.icon} width="20" height="20" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-blue-100 transition hover:bg-white/10 hover:text-white"
        >
          <Icon
            icon="mdi:logout"
            width="20"
            height="20"
          />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;