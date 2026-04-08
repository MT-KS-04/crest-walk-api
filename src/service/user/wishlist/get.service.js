/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Wishlist from '../../../model/wishlist.model.js';

/**
 * Get wishlist of user
 * @param {string} userId - ID of user
 * @returns {Promise<Array>} - List of wishlist items
 */
const getWishlistService = async (userId) => {
  try {
    const wishlist = await Wishlist.find({ user_id: userId })
      .populate('product_id')
      .sort({ createdAt: -1 });

    return wishlist;
  } catch (error) {
    throw error;
  }
};

export default getWishlistService;
