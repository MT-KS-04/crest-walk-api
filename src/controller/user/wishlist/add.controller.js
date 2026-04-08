/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import addService from '../../../service/user/wishlist/add.service.js';

const add = async (req, res) => {
  try {
    const wishlistItem = await addService(req.userId, req.body);

    res.status(201).json({
      success: true,
      data: wishlistItem,
      message: 'Product added to wishlist successfully',
    });

    logger.info('Product added to wishlist successfully', {
      userId: req.userId,
      payload: req.body,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code:
        status === 400
          ? 'BadRequest'
          : status === 404
            ? 'NotFound'
            : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error adding to wishlist', error);
  }
};

export default add;
