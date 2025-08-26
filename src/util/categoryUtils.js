/**
 * Normalize category names to lowercase for consistent comparison
 * @param {string} category - The category name to normalize
 * @returns {string} - Normalized lowercase category name
 */
export const normalizeCategory = (category) => {
  if (!category || typeof category !== 'string') {
    return undefined;
  }
  return category.trim().toLowerCase();
};

/**
 * Compare two categories case-insensitively
 * @param {string} category1 - First category
 * @param {string} category2 - Second category
 * @returns {boolean} - True if categories match (case-insensitive)
 */
export const categoriesMatch = (category1, category2) => {
  const norm1 = normalizeCategory(category1);
  const norm2 = normalizeCategory(category2);
  
  if (!norm1 || !norm2) {
    return false;
  }
  
  return norm1 === norm2;
};

/**
 * Filter dishes by category (case-insensitive)
 * @param {Array} dishes - Array of dishes
 * @param {string} targetCategory - Category to filter by
 * @returns {Array} - Filtered dishes
 */
export const filterDishesByCategory = (dishes, targetCategory) => {
  if (!dishes || !Array.isArray(dishes)) {
    return [];
  }
  
  if (!targetCategory || targetCategory === 'all') {
    return dishes;
  }
  
  const normalizedTarget = normalizeCategory(targetCategory);
  
  return dishes.filter(dish => {
    const dishCategory = normalizeCategory(dish.category);
    return dishCategory === normalizedTarget;
  });
};
