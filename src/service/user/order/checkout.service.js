/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Cart from '../../../model/cart.model.js';
import Product from '../../../model/product.model.js';
import Order from '../../../model/order.model.js';
import crypto from 'crypto';
import { sortObject, getVnpTime, VNPAY_CONFIG } from '../payment/vnpayUtils.js';

const checkoutService = async (userId, payload, reqIp) => {
  const { address, phone, payment_method } = payload;

  if (!address || !phone) {
    const error = new Error('Address and phone are required for checkout');
    error.status = 400;
    throw error;
  }

  // Mặc định ép kiểu phương thức thanh toán hoặc gán mặc định COD
  const method = payment_method || 'COD';
  if (!['COD', 'Online'].includes(method)) {
    const error = new Error('Invalid payment method. Choose COD or Online.');
    error.status = 400;
    throw error;
  }

  // 1. Phục hồi giỏ hàng
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty. Cannot place an order.');
    error.status = 400;
    throw error;
  }

  // 2. Kiểm tra sản phẩm và lấy giá chính xác
  let total_price = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product_id);
    
    if (!product) {
      const error = new Error(`Product mapping failed for ID: ${item.product_id}`);
      error.status = 404;
      throw error;
    }

    // Kiểm tra hàng trong kho theo size
    const productSize = product.sizes.find(s => s.size === item.size);
    if (!productSize || productSize.quantity < item.quantity) {
      const error = new Error(`Insufficient stock for product ${product.name} (Size: ${item.size})`);
      error.status = 400;
      throw error;
    }

    // Lắp ghép chi tiết hóa đơn
    const itemTotalPrice = product.price * item.quantity;
    total_price += itemTotalPrice;

    orderItems.push({
      product_id: product._id,
      product_name: product.name,
      size: item.size,
      quantity: item.quantity,
      price: product.price, // Giá tại thời điểm cắm hóa đơn
    });
  }

  // 3. Khởi tạo Đơn hàng (Order)
  const order = new Order({
    user_id: userId,
    items: orderItems,
    total_price: total_price,
    status: 'pending',
    payment_method: method,
    payment_status: 'unpaid', // Lúc nào thanh toán qua cổng thì update thành 'paid', COD thì đợi nhận hàng
    address: address,
    phone: phone,
  });

  await order.save();

  // 4. Trừ lượng hàng trong kho (Inventory mechanism - Trừ trực tiếp)
  for (const item of orderItems) {
    await Product.findOneAndUpdate(
      { _id: item.product_id, 'sizes.size': item.size },
      { $inc: { 'sizes.$.quantity': -item.quantity } }
    );
  }

  // 5. Làm sạch giỏ hàng người dùng
  cart.items = [];
  await cart.save();

  // 6. Xử lý VNPAY URL nếu chọn Online
  if (method === 'Online') {
    const ipAddr = reqIp || '127.0.0.1';
    
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = VNPAY_CONFIG.vnp_TmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = order._id.toString();
    vnp_Params['vnp_OrderInfo'] = `Thanh toan hoa don giay CrestWalk: ${order._id}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = total_price * 100; // VNPAY nhận số tiền nhân 100
    vnp_Params['vnp_ReturnUrl'] = VNPAY_CONFIG.vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = getVnpTime();

    vnp_Params = sortObject(vnp_Params);
    
    const signData = new URLSearchParams(vnp_Params).toString();
    const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnp_Params['vnp_SecureHash'] = signed;
    const finalUrl = VNPAY_CONFIG.vnp_Url + '?' + new URLSearchParams(vnp_Params).toString();

    // Trả về kèm URL để FrontEnd redirect
    return { order, paymentUrl: finalUrl };
  }

  return { order, paymentUrl: null };
};

export default checkoutService;
