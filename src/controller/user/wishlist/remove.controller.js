/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteService from '../../../service/user/wishlist/delete.service.js';

const remove = async (req, res) => {
  try {
    const { productId } = req.params;
    await deleteService(req.userId, productId);

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
    });

    logger.info('Product removed from wishlist', { userId: req.userId, productId });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 404 ? 'NotFound' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error removing from wishlist', error);
  }
};

export default remove;
