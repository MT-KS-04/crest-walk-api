import logger from '../../../lib/winston.js';
import trackOrderService from '../../../service/user/order/trackOrder.service.js';

const trackOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId || req.query.id;
    const phone = req.query.phone;
    const userId = req.userId || null;

    const data = await trackOrderService(orderId, phone, userId);

    res.status(200).json({
      success: true,
      data,
      message: 'Order tracked successfully',
    });

    logger.info('Order tracked (public)', { orderId });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code:
        status === 404
          ? 'NotFound'
          : status === 403
            ? 'Forbidden'
            : status === 400
              ? 'BadRequest'
              : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error tracking order', error);
  }
};

export default trackOrder;
