/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';
import Product from '../../../model/product.model.js';

/**
 * Hủy đơn hàng và phục hồi tồn kho
 * @param {string} userId - ID của người dùng thực hiện yêu cầu
 * @param {string} orderId - ID của đơn hàng cần hủy
 * @returns {Promise<Object>} - Đơn hàng đã được cập nhật
 */
const cancelService = async (userId, orderId) => {
  // 1. Tìm đơn hàng
  const order = await Order.findOne({ _id: orderId, user_id: userId });

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  // 2. Kiểm tra trạng thái (Chỉ được hủy khi đang pending)
  if (order.status !== 'pending') {
    const error = new Error(`Cannot cancel order. Current status: ${order.status}`);
    error.status = 400;
    throw error;
  }

  // 3. Cập nhật trạng thái đơn hàng
  order.status = 'cancelled';
  await order.save();

  // 4. Phục hồi tồn kho (Inventory Rollback)
  // Duyệt qua các items trong đơn hàng để cộng lại số lượng vào Product
  const restorePromises = order.items.map(async (item) => {
    return await Product.findOneAndUpdate(
      { _id: item.product_id, 'sizes.size': item.size },
      { $inc: { 'sizes.$.quantity': item.quantity } }
    );
  });

  await Promise.all(restorePromises);

  return order;
};

export default cancelService;
