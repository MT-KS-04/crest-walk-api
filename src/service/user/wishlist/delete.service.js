/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Wishlist from '../../../model/wishlist.model.js';

const deleteService = async (userId, productId) => {
  const result = await Wishlist.findOneAndDelete({
    user_id: userId,
    product_id: productId,
  });

  if (!result) {
    const error = new Error('Product not found in wishlist');
    error.status = 404;
    throw error;
  }

  return result;
};

export default deleteService;
