/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import cancelService from '../../../service/user/order/cancel.service.js';

/**
 * Controller xử lý yêu cầu hủy đơn hàng
 */
const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await cancelService(req.userId, id);

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order cancelled successfully and inventory restored',
    });

    logger.info('Order cancelled', { userId: req.userId, orderId: id });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error cancelling order', error);
  }
};

export default cancel;
