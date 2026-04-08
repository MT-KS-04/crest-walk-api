/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Wishlist from '../../../model/wishlist.model.js';

const getService = async (userId) => {
  const wishlist = await Wishlist.find({ user_id: userId })
    .populate('product_id')
    .sort({ createdAt: -1 });

  return wishlist;
};

export default getService;
