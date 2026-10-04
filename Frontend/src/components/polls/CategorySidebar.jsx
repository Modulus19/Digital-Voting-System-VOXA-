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
    <aside className="rounded-2xl border border-primary bg-white p-4 transition-shadow duration-200 lg:p-5">
      <h2 className="mb-3 text-sm font-semibold text-text-heading sm:text-base lg:mb-5 lg:text-center">
        Categories
      </h2>

      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0
        "
      >
        {CATEGORIES.map((category) => {
          const isSelected =
            selectedCategory === category.value;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() =>
                onCategoryChange(
                  isSelected
                    ? null
                    : category.value
                )
              }
              aria-pressed={isSelected}
              className={`
                flex shrink-0 items-center gap-2 rounded-lg
                px-3 py-2 text-left text-xs font-medium
                transition-all duration-200
                sm:text-sm
                lg:w-full lg:gap-3
                ${
                  isSelected
                    ? "bg-blue-50 text-primary"
                    : "text-text-heading hover:bg-surface"
                }
              `}
            >
              <Icon
                icon={
                  CATEGORY_ICONS[
                    category.value
                  ]
                }
                width={20}
                height={20}
                className="shrink-0 lg:h-[22px] lg:w-[22px]"
              />

              <span className="whitespace-nowrap">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}