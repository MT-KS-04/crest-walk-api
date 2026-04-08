/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const detailService = async (userId, orderId) => {
  const order = await Order.findById(orderId).lean();

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  // Khóa an toàn: Chặn không cho User coi lén Đơn hàng của người dùng khác
  if (order.user_id.toString() !== userId.toString()) {
    const error = new Error('Unauthorized access to this order');
    error.status = 403;
    throw error;
  }

  // Bạn có thể format lại data chi tiết ở đây nếu cần, nhưng DB đang là đủ
  return order;
};

export default detailService;
