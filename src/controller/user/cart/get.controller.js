/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getService from '../../../service/user/cart/get.service.js';

const get = async (req, res) => {
  try {
    const data = await getService(req.userId);
    res.status(200).json({ success: true, ...data });

    logger.info('Fetched user cart successfully', { userId: req.userId });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 404 ? 'NotFound' : 'ServerError',
      message: error.message,
    });
    logger.error('Error fetching cart', error);
  }
};

export default get;
