import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

const Sidebar = ({ onClose }) => {
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

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1554B8] text-white">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <NavLink to="/admin" onClick={onClose}>
          <span className="text-2xl font-bold tracking-tight">
            VOXA
          </span>
        </NavLink>
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
        <NavLink
          to="/admin/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-[#3B82F6] text-white"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Icon
            icon="mdi:cog-outline"
            width="20"
            height="20"
          />
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-blue-100 transition hover:bg-white/10 hover:text-white"
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

