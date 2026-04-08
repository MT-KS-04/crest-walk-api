/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import historyService from '../../../service/user/order/history.service.js';

const history = async (req, res) => {
  try {
    const orders = await historyService(req.userId);

    res.status(200).json({
      success: true,
      data: orders,
      message: 'Order history fetched successfully',
    });

    logger.info('Order history fetched', {
      userId: req.userId,
      count: orders.length,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error fetching order history', error);
  }
};

export default history;
