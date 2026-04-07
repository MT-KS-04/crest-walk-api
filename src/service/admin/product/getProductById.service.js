/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';

const getProductByIdService = async (id) => {
  const product = await Product.findById(id)
    .populate('category_id', 'name slug')
    .populate('brand_id', 'name slug')
    .lean()
    .exec();

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export default getProductByIdService;
