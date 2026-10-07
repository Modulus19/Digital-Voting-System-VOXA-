export const CATEGORIES = [
  { value: "education", label: "Education", icon: "mdi:book-open-page-variant-outline" },
  { value: "technology", label: "Technology", icon: "mdi:laptop" },
  { value: "sports", label: "Sports", icon: "mdi:soccer" },
  { value: "lifestyle", label: "Lifestyle", icon: "mdi:account-heart-outline" },
  { value: "food", label: "Food", icon: "mdi:food-fork-drink" },
  { value: "others", label: "Others", icon: "mdi:shape-outline" },
];

export const CATEGORY_ICONS = Object.fromEntries(
  CATEGORIES.map(({ value, icon }) => [value, icon])
);