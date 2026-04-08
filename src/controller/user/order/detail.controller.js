/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import detailService from '../../../service/user/order/detail.service.js';

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await detailService(req.userId, id);

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order detail fetched successfully',
    });

    logger.info('Order detail fetched', { userId: req.userId, orderId: id });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code:
        status === 404
          ? 'NotFound'
          : status === 403
            ? 'Forbidden'
            : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error fetching order detail', error);
  }
};

export default detail;
