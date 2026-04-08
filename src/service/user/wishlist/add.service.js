/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Wishlist from '../../../model/wishlist.model.js';
import Product from '../../../model/product.model.js';

const addService = async (userId, payload) => {
  const { product_id } = payload;

  if (!product_id) {
    const error = new Error('Product ID is required');
    error.status = 400;
    throw error;
  }

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = await Product.findById(product_id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  // Kiểm tra xem sản phẩm đã có trong wishlist chưa
  const existingItem = await Wishlist.findOne({ user_id: userId, product_id });
  if (existingItem) {
    const error = new Error('Product is already in wishlist');
    error.status = 400;
    throw error;
  }

  // Thêm vào wishlist
  const newWishlistItem = new Wishlist({
    user_id: userId,
    product_id
  });

  await newWishlistItem.save();
  return newWishlistItem;
};

export default addService;
