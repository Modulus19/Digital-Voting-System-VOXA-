import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Icon } from "@iconify/react";
import Sidebar from "../components/admin/Sidebar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const adminName =
    user?.username ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Admin";

  const initials = adminName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Area */}
      <div className="min-h-screen md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-gray-100 md:hidden"
            aria-label="Open admin menu"
          >
            <Icon
              icon="mdi:menu"
              width="24"
              height="24"
            />
          </button>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#0F172A]">
                {adminName}
              </p>
              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;