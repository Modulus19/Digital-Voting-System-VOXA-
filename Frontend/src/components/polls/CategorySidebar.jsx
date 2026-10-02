import { Icon } from "@iconify/react";

import {
  CATEGORIES,
  CATEGORY_ICONS,
} from "../../utils/pollConstants";


export default function CategorySidebar({
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <aside className="rounded-2xl border border-primary bg-white p-5">
      <h2 className="mb-5 text-center text-base font-semibold text-text-heading">
        Categories
      </h2>

      <div className="flex flex-col gap-1">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() =>
              onCategoryChange(
                selectedCategory === category.value
                  ? null
                  : category.value
              )
            }
            aria-pressed={selectedCategory === category.value}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              selectedCategory === category.value
                ? "bg-blue-50 text-primary"
                : "text-text-heading hover:bg-surface"
            }`}
          >
            <Icon
              icon={CATEGORY_ICONS[category.value]}
              width={22}
              height={22}
            />

            {category.label}
          </button>
        ))}
      </div>
    </aside>
  );
}