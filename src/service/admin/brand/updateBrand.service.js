/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Brand from '../../../model/brand.model.js';
import { generateSlug } from '../../../utils/slug.utils.js';

const updateBrandService = async (id, data) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    const error = new Error('Brand not found');
    error.statusCode = 404;
    throw error;
  }

  // Determine slug
  let slug = data.slug;
  if (!slug && data.name && data.name !== brand.name) {
    // Generate new slug only if name changed
    slug = generateSlug(data.name);
  }

  // Check for uniqueness
  if (data.name || slug) {
    const filter = [];
    if (data.name) filter.push({ name: data.name });
    if (slug) filter.push({ slug: slug });

    const existingBrand = await Brand.findOne({
      _id: { $ne: id },
      $or: filter,
    });

    if (existingBrand) {
      const error = new Error('Brand name or slug already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (slug) updateData.slug = slug;
  if (data.logo !== undefined) updateData.logo = data.logo; // allows null
  if (data.description !== undefined) updateData.description = data.description; // allows null

  const updatedBrand = await Brand.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).exec();

  return updatedBrand;
};

export default updateBrandService;
