/**
 * Tra cứu đơn công khai: khớp SĐT với đơn, hoặc user đăng nhập là chủ đơn.
 */
import Order from '../../../model/order.model.js';

const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value));

const normalizePhone = (p) => String(p || '').replace(/\D/g, '');

const phonesMatch = (input, stored) => {
  const a = normalizePhone(input);
  const b = normalizePhone(stored);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 9 && b.length >= 9 && a.slice(-9) === b.slice(-9)) return true;
  return false;
};

const trackOrderService = async (orderId, phone, userId) => {
  if (!orderId || !isMongoId(orderId)) {
    const err = new Error('Mã đơn hàng không hợp lệ');
    err.status = 400;
    throw err;
  }

  const order = await Order.findById(orderId)
    .populate('items.product_id', 'name images')
    .lean();

  if (!order) {
    const err = new Error('Không tìm thấy đơn hàng');
    err.status = 404;
    throw err;
  }

  if (userId && order.user_id.toString() === userId.toString()) {
    return order;
  }

  if (!phone || !String(phone).trim()) {
    const err = new Error(
      'Vui lòng nhập số điện thoại đặt hàng để tra cứu (hoặc đăng nhập tài khoản đã đặt đơn)',
    );
    err.status = 400;
    throw err;
  }

  if (!phonesMatch(phone, order.phone)) {
    const err = new Error('Số điện thoại không khớp với đơn hàng này');
    err.status = 403;
    throw err;
  }

  return order;
};

export default trackOrderService;
