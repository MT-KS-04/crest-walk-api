/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';
import Category from '../../../model/category.model.js';
import Brand from '../../../model/brand.model.js';

const createProductService = async (data) => {
  // Option: Verify if Category exists
  const categoryExists = await Category.exists({ _id: data.category_id });
  if (!categoryExists) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  // Option: Verify if Brand exists.
  const brandExists = await Brand.exists({ _id: data.brand_id });
  if (!brandExists) {
    const error = new Error('Brand not found');
    error.statusCode = 404;
    throw error;
  }

  // Create new product
  const newProduct = await Product.create({
    name: data.name,
    price: data.price,
    original_price: data.original_price || null,
    description: data.description || '',
    category_id: data.category_id,
    brand_id: data.brand_id,
    images: data.images,
    publicIds: data.publicIds || [],
    sizes: data.sizes || [],
  });

  return newProduct;
};

export default createProductService;
