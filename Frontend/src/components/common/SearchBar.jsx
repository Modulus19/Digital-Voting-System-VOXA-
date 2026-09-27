import { Icon } from "@iconify/react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search polls...",
}) {
  return (
    <div className="relative w-full">
      <Icon
        icon="mdi:magnify"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        width="20"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-[#ff4d6d] focus:ring-1 focus:ring-[#ff4d6d]"
      />
    </div>
  );
}