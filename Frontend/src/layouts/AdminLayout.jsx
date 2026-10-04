import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Icon } from "@iconify/react";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

          {/* Desktop Search */}
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                width="20"
                height="20"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search anything..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#3B82F6] focus:bg-white"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-gray-100 hover:text-[#3B82F6]"
              aria-label="Notifications"
            >
              <Icon
                icon="mdi:bell-outline"
                width="21"
                height="21"
              />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#3B82F6]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white">
                AD
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#0F172A]">
                  Admin
                </p>
                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
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