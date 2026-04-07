/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Product from '../../../model/product.model.js';

const updateStockService = async (productId, size, quantity, mode = 'set') => {
  const quantityValue = parseInt(quantity);
  const sizeValue = parseInt(size);

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if size exists in the product
  const sizeIndex = product.sizes.findIndex(s => s.size === sizeValue);
  if (sizeIndex === -1) {
    const error = new Error(`Size ${sizeValue} not found for this product.`);
    error.statusCode = 404;
    throw error;
  }

  // Update logic based on mode
  let updatedProduct;
  if (mode === 'inc') {
    updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, 'sizes.size': sizeValue },
      { $inc: { 'sizes.$.quantity': quantityValue } },
      { new: true, runValidators: true }
    ).exec();
  } else {
    // Mode is 'set'
    updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, 'sizes.size': sizeValue },
      { $set: { 'sizes.$.quantity': quantityValue } },
      { new: true, runValidators: true }
    ).exec();
  }

  return updatedProduct;
};

export default updateStockService;
