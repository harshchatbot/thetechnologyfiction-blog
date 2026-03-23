import type { Category } from "@/types/content";

export function getCategorySummary(category: Category) {
  const description = category.description?.trim();

  if (
    !description ||
    /^imported from wordpress category/i.test(description) ||
    /^category archive/i.test(description)
  ) {
    return `Sharp articles, practical guides, and technical commentary across ${category.name.toLowerCase()}.`;
  }

  return description;
}
