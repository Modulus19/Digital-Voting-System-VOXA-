// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-white px-16 py-14">
        <div className="max-w-6xl mx-auto flex justify-between flex-wrap gap-10">
          <div>
            <div className="text-xl font-extrabold mb-2">Voxa</div>
            <p className="text-sm text-slate-400 max-w-xs">
              A simple way to ask, vote, and see what everyone really thinks.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4">Product</h4>
            <a href="/" className="block text-sm text-slate-400 mb-2">Home</a>
            <a href="/about" className="block text-sm text-slate-400 mb-2">About</a>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4">Account</h4>
            <a href="/login" className="block text-sm text-slate-400 mb-2">Log In</a>
            <a href="/register" className="block text-sm text-slate-400 mb-2">Sign Up</a>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-xs text-slate-500">
          © 2026 Voxa. Built for Everyone.
        </div>
      </footer>
    </div>
  );
}