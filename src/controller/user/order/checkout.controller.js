/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import checkoutService from '../../../service/user/order/checkout.service.js';

const checkout = async (req, res) => {
  try {
    const order = await checkoutService(req.userId, req.body);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully',
    });

    logger.info('Order placed successfully', { userId: req.userId, orderId: order._id });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : (status === 404 ? 'NotFound' : 'ServerError'),
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error placing order', error);
  }
};

export default checkout;
