/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';
import Order from '../../../model/order.model.js';

const deleteProductService = async (id) => {
  // Check if product exists
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if product is referenced in any order
  const isReferencedInOrder = await Order.exists({ 'items.product_id': id });

  if (isReferencedInOrder) {
    const error = new Error(
      'Cannot delete product because it is present in one or more orders.',
    );
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // Hard delete
  await Product.findByIdAndDelete(id);

  return true;
};

export default deleteProductService;
