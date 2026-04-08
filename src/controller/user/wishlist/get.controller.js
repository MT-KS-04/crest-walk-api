/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import getWishlistService from '../../../service/user/wishlist/get.service.js';
import logger from '../../../lib/winston.js';

/**
 * Get wishlist of user controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getWishlistController = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await getWishlistService(userId);

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    logger.error(`Error in getWishlistController: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default getWishlistController;
