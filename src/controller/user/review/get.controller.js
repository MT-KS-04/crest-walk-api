/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getService from '../../../service/user/review/get.service.js';

const get = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await getService(productId);

    res.status(200).json({
      success: true,
      data: reviews,
      message: 'Reviews fetched successfully',
    });

    logger.info('Reviews fetched successfully', { productId, reviewCount: reviews.length });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 404 ? 'NotFound' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error fetching reviews', error);
  }
};

export default get;
