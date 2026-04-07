/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getOrdersService from '../../../service/admin/order/getOrders.service.js';

const getOrders = async (req, res) => {
  try {
    const data = await getOrdersService(req.query);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting orders', error);
  }
};

export default getOrders;
