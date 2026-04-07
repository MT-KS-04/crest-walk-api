/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateOrderStatusService from '../../../service/admin/order/updateOrderStatus.service.js';

const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await updateOrderStatusService(req.params.id, req.body);

    res.status(200).json({
      message: 'Order updated successfully',
      data: updatedOrder,
    });

    logger.info(`Order updated: ${req.params.id}`);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error updating order: ${req.params.id}`, error);
  }
};

export default updateOrderStatus;
