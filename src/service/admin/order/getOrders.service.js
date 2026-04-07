/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const getOrdersService = async (query) => {
  const { page = 1, limit = 10, status, payment_status, user_id } = query;

  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (payment_status) {
    filter.payment_status = payment_status;
  }
  if (user_id) {
    filter.user_id = user_id;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitValue = parseInt(limit);

  const orders = await Order.find(filter)
    .populate('user_id', 'full_name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitValue)
    .lean()
    .exec();

  const total = await Order.countDocuments(filter);

  return {
    orders,
    pagination: {
      total,
      page: parseInt(page),
      limit: limitValue,
      totalPages: Math.ceil(total / limitValue),
    },
  };
};

export default getOrdersService;
