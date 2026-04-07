/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';

const searchService = async (query) => {
  const { keyword } = query;

  if (!keyword) {
    const error = new Error('Keyword is required');
    error.status = 400;
    throw error;
  }

  const filter = {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ],
  };

  const products = await Product.find(filter)
    .populate('category_id', 'name')
    .populate('brand_id', 'name');

  return {
    products,
    totalResults: products.length,
  };
};

export default searchService;
