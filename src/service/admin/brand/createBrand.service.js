/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Brand from '../../../model/brand.model.js';
import { generateSlug } from '../../../utils/slug.utils.js';

const createBrandService = async (data) => {
  let slug = data.slug;
  if (!slug) {
    slug = generateSlug(data.name);
  }

  // Check for uniqueness
  const existingBrand = await Brand.findOne({
    $or: [{ name: data.name }, { slug: slug }],
  });

  if (existingBrand) {
    const error = new Error('Brand name or slug already exists');
    error.statusCode = 409;
    throw error;
  }

  const newBrand = await Brand.create({
    name: data.name,
    slug: slug,
    logo: data.logo || null,
    description: data.description || null,
  });

  return newBrand;
};

export default createBrandService;
