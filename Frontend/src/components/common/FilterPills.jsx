export default function FilterPills({
  filters = [],
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter
              ? "bg-[#ff4d6d] text-white"
              : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}