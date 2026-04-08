/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import vnpayReturnService from '../../../service/user/payment/vnpayReturn.service.js';
import config from '../../../config/env.config.js';

const vnpayReturn = async (req, res) => {
  try {
    // VNPAY thường bắn query params (GET request)
    const result = await vnpayReturnService(req.query);

    if (result.success) {
      logger.info('VNPAY payment success', { orderId: result.orderId });
      // Redirect về frontend
      res.redirect(`${config.FRONTEND_URL}/order-tracking?id=${result.orderId}&payment_status=success`);
    } else {
      logger.warn('VNPAY payment failed', { orderId: result.orderId });
      res.redirect(`${config.FRONTEND_URL}/order-tracking?id=${result.orderId}&payment_status=failed`);
    }

  } catch (error) {
    logger.error('VNPAY Return Error', error);
    res.redirect(`${config.FRONTEND_URL}/cart?payment_status=error`);
  }
};

export default vnpayReturn;
