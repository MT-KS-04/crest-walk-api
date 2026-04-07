/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';

const getProductsService = async (query) => {
  const { page = 1, limit = 10, search, category, brand } = query;

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category_id = category;
  }
  if (brand) {
    filter.brand_id = brand;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitValue = parseInt(limit);

  // Populate category and brand names to show in admin table
  const products = await Product.find(filter)
    .populate('category_id', 'name slug')
    .populate('brand_id', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitValue)
    .lean()
    .exec();

  const total = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: limitValue,
      totalPages: Math.ceil(total / limitValue),
    },
  };
};

export default getProductsService;
