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
      message: 'Order placed successfully',
      data: order,
    });

    logger.info('User placed an order successfully', {
      userId: req.userId,
      orderId: order._id,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : 'ServerError',
      message: error.message,
    });

    logger.error('Error placing order', error);
  }
};

export default checkout;
