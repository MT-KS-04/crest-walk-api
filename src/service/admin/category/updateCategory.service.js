/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Category from '../../../model/category.model.js';
import { generateSlug } from '../../../utils/slug.utils.js';

const updateCategoryService = async (id, data) => {
  const category = await Category.findById(id);
  
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  // Determine slug
  let slug = data.slug;
  if (!slug && data.name && data.name !== category.name) {
    // Generate new slug only if name changed and slug was not explicitly provided
    slug = generateSlug(data.name);
  }

  // Check for uniqueness if name or slug is being updated
  if (data.name || slug) {
    const filter = [];
    if (data.name) filter.push({ name: data.name });
    if (slug) filter.push({ slug: slug });

    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      $or: filter,
    });

    if (existingCategory) {
      const error = new Error('Category name or slug already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (slug) updateData.slug = slug;

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).exec();

  return updatedCategory;
};

export default updateCategoryService;
