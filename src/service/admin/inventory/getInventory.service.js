/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';

const getInventoryService = async (query) => {
  const { page = 1, limit = 10, search, lowStock } = query;

  const lowStockThreshold = 5;

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // If lowStock is true, filter products where any size has quantity < threshold
  if (lowStock === 'true' || lowStock === true) {
    filter.sizes = {
      $elemMatch: { quantity: { $lt: lowStockThreshold } },
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitValue = parseInt(limit);

  const inventory = await Product.find(filter)
    .select('name images sizes')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitValue)
    .lean()
    .exec();

  const total = await Product.countDocuments(filter);

  return {
    inventory,
    pagination: {
      total,
      page: parseInt(page),
      limit: limitValue,
      totalPages: Math.ceil(total / limitValue),
    },
    threshold: lowStockThreshold,
  };
};

export default getInventoryService;
