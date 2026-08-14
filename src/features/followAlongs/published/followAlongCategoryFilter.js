export const ALL_FOLLOW_ALONG_CATEGORIES = 'All';

export function getSortedFollowAlongCategories(programmes = []) {
  const categoriesByName = new Map();
  programmes.forEach(programme => {
    const category = String(programme?.category || '').trim();
    const normalized = category.toLocaleLowerCase();
    if (!category || normalized === ALL_FOLLOW_ALONG_CATEGORIES.toLocaleLowerCase()) return;
    if (!categoriesByName.has(normalized)) categoriesByName.set(normalized, category);
  });

  return [
    ALL_FOLLOW_ALONG_CATEGORIES,
    ...categoriesByName.values()
  ].sort((left, right) => {
    if (left === ALL_FOLLOW_ALONG_CATEGORIES) return -1;
    if (right === ALL_FOLLOW_ALONG_CATEGORIES) return 1;
    return left.localeCompare(right, undefined, { sensitivity: 'base' });
  });
}
