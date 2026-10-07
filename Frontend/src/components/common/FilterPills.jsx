import { useEffect, useRef, useState } from "react";

export default function FilterPills({
  filters = [],
  activeFilter,
  onFilterChange,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const handleFilterChange = (filter) => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((open) => !open)
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="
          inline-flex min-h-9 items-center justify-center
          gap-2 rounded-md bg-blue-500 px-3 py-1.5
          text-xs font-semibold text-white outline-none
          transition-all duration-200
          hover:bg-blue-600
          active:scale-[0.98]
          sm:px-4
        "
      >
        <span>{activeFilter}</span>

        <span
          className={`
            h-0 w-0
            border-l-[4px] border-r-[4px] border-t-[5px]
            border-l-transparent border-r-transparent
            border-t-white
            transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      <div
        role="listbox"
        aria-hidden={!isOpen}
        className={`
          absolute left-0 top-full z-30 mt-2
          min-w-[160px] origin-top-left
          overflow-hidden rounded-lg
          border border-slate-200 bg-white py-1
          shadow-lg

          transition-all duration-200 ease-out

          ${
            isOpen
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-1 scale-[0.98] opacity-0 pointer-events-none"
          }
        `}
      >
        {filters.map((filter) => {
          const isActive =
            filter === activeFilter;

          return (
            <button
              key={filter}
              type="button"
              role="option"
              aria-selected={isActive}
              tabIndex={isOpen ? 0 : -1}
              onClick={() =>
                handleFilterChange(filter)
              }
              className={`
                block w-full whitespace-nowrap
                px-4 py-2.5 text-left text-sm
                transition-colors duration-150

                ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}