/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';
import Category from '../../../model/category.model.js';
// import Brand from '../../../model/brand.model.js';

const updateProductService = async (id, data) => {
  // Check if product exists
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate category if updating
  if (data.category_id) {
    const categoryExists = await Category.exists({ _id: data.category_id });
    if (!categoryExists) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
  }

  // Validate brand if updating
  // if (data.brand_id) {
  //   const brandExists = await Brand.exists({ _id: data.brand_id });
  //   if (!brandExists) {
  //     const error = new Error('Brand not found');
  //     error.statusCode = 404;
  //     throw error;
  //   }
  // }

  // Update fields
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }, // Return updated doc, run schema validations
  ).exec();

  return updatedProduct;
};

export default updateProductService;
