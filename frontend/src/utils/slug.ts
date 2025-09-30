// Utility functions for slug generation and handling

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Check if a slug matches a given text (for fallback matching)
 * @param slug - The slug to check
 * @param text - The text to compare against
 * @returns True if the slug matches the text
 */
export function slugMatches(slug: string, text: string): boolean {
  const generatedSlug = generateSlug(text);
  return slug === generatedSlug;
}

/**
 * Find an item by slug in an array
 * @param items - Array of items to search
 * @param slug - The slug to find
 * @param slugField - The field name that contains the slug (default: 'slug')
 * @param titleField - The field name that contains the title for fallback matching (default: 'title')
 * @returns The found item or undefined
 */
export function findItemBySlug<T>(
  items: T[],
  slug: string,
  slugField: keyof T = 'slug' as keyof T,
  titleField: keyof T = 'title' as keyof T
): T | undefined {
  return items.find((item) => {
    const itemSlug = item[slugField] as string;
    const itemTitle = item[titleField] as string;
    
    // First try exact slug match
    if (itemSlug === slug) {
      return true;
    }
    
    // Then try generated slug match from title
    if (itemTitle && slugMatches(slug, itemTitle)) {
      return true;
    }
    
    return false;
  });
}

