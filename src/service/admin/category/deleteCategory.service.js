/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Category from '../../../model/category.model.js';
import Product from '../../../model/product.model.js';

const deleteCategoryService = async (id) => {
  // Check if category exists
  const category = await Category.findById(id);

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if category has any products
  const hasProducts = await Product.exists({ category_id: id });

  if (hasProducts) {
    const error = new Error(
      'Cannot delete category because it contains products. Reassign or delete the products first.',
    );
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // Delete category
  await Category.findByIdAndDelete(id);

  return true;
};

export default deleteCategoryService;
