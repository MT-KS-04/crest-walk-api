/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import vnpayReturnService from '../../../service/user/payment/vnpayReturn.service.js';

const vnpayReturn = async (req, res) => {
  try {
    // VNPAY thường bắn query params (GET request)
    const result = await vnpayReturnService(req.query);

    if (result.success) {
      // Bạn có thể redirect về frontend kèm message hoặc trả ra JSON cho test
      res.status(200).json({
        success: true,
        message: result.message,
        orderId: result.orderId,
      });
      logger.info('VNPAY payment success', { orderId: result.orderId });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        orderId: result.orderId,
      });
    }
  } catch (error) {
    logger.error('VNPAY Return Error', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default vnpayReturn;
