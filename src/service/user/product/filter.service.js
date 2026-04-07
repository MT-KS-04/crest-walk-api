/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';

const filterService = async (query) => {
  const { minPrice, maxPrice, size, brand, sortBy } = query;
  
  const filter = {};

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (size) {
    filter['sizes.size'] = Number(size);
    filter['sizes.quantity'] = { $gt: 0 }; 
  }

  if (brand) {
    filter.brand_id = brand; 
  }

  let dbQuery = Product.find(filter)
    .populate('category_id', 'name')
    .populate('brand_id', 'name');

  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        dbQuery = dbQuery.sort({ price: 1 });
        break;
      case 'price_desc':
        dbQuery = dbQuery.sort({ price: -1 });
        break;
      case 'newest':
        dbQuery = dbQuery.sort({ createdAt: -1 });
        break;
      case 'rating': 
        dbQuery = dbQuery.sort({ rating: -1 });
        break;
      default:
        dbQuery = dbQuery.sort({ createdAt: -1 });
    }
  } else {
    // Mặc định luôn sort theo ngày tạo mới nhất
    dbQuery = dbQuery.sort({ createdAt: -1 });
  }

  const products = await dbQuery;

  return {
    products,
    totalFiltersApplied: Object.keys(filter).length,
    totalResults: products.length,
  };
};

export default filterService;
