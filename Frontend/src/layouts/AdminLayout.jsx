// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-10">
        <Outlet />
      </main>
    </div>
  );
}