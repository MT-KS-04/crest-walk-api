/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getService from '../../../service/user/wishlist/get.service.js';

const get = async (req, res) => {
  try {
    const wishlist = await getService(req.userId);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 404 ? 'NotFound' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error fetching wishlist', error);
  }
};

export default get;
