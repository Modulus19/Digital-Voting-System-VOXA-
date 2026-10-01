// src/components/common/Sidebar.jsx
export default function Sidebar({ links }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="text-xl font-extrabold text-slate-900 mb-1">Voxa</div>
      <div className="text-xs text-slate-400 mb-8">Admin</div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <a
            key={link.path}
            href={link.path}
            className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-gray-50"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}