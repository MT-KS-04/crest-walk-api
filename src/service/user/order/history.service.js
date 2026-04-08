/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';
import Product from '../../../model/product.model.js';

const historyService = async (userId) => {
  // Lấy đơn hàng và sắp xếp theo ngày tháng giảm dần (Mới nhất nằm trên)
  const orders = await Order.find({ user_id: userId })
    .select('-user_id -updatedAt -__v') // Ẩn bớt các trường không cần thiết cho gọn nhẹ
    .populate('items.product_id', 'images')
    .sort({ createdAt: -1 })
    .lean(); // Faster query execution

  return orders;
};

export default historyService;
