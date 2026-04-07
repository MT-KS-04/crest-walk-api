/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Category from '../../../model/category.model.js';
import { generateSlug } from '../../../utils/slug.utils.js';

const createCategoryService = async (data) => {
  // Determine slug
  let slug = data.slug;
  if (!slug) {
    slug = generateSlug(data.name);
  }

  // Check if name or slug already exists
  const existingCategory = await Category.findOne({
    $or: [{ name: data.name }, { slug: slug }],
  });

  if (existingCategory) {
    const error = new Error('Category name or slug already exists');
    error.statusCode = 409; // Conflict
    throw error;
  }

  const newCategory = await Category.create({
    name: data.name,
    slug: slug,
  });

  return newCategory;
};

export default createCategoryService;
