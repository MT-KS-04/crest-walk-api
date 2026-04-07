/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const getOrderByIdService = async (id) => {
  const order = await Order.findById(id)
    .populate('user_id', 'full_name email')
    // .populate('voucher_id') // Uncomment if Voucher schema is fully implemented
    .lean()
    .exec();

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export default getOrderByIdService;
