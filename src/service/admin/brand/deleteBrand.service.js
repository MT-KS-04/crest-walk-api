/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Brand from '../../../model/brand.model.js';
import Product from '../../../model/product.model.js';

const deleteBrandService = async (id) => {
  // Check if brand exists
  const brand = await Brand.findById(id);

  if (!brand) {
    const error = new Error('Brand not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if brand has any products
  const hasProducts = await Product.exists({ brand_id: id });

  if (hasProducts) {
    const error = new Error(
      'Cannot delete brand because it contains products. Reassign or delete the products first.',
    );
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // Hard delete
  await Brand.findByIdAndDelete(id);

  return true;
};

export default deleteBrandService;
