/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import crypto from 'crypto';
import Order from '../../../model/order.model.js';
import { sortObject, VNPAY_CONFIG } from './vnpayUtils.js';

const vnpayReturnService = async (vnpayParams) => {
  let vnp_SecureHash = vnpayParams['vnp_SecureHash'];
  delete vnpayParams['vnp_SecureHash'];
  delete vnpayParams['vnp_SecureHashType'];

  // Sắp xếp dữ liệu theo thứ tự alphabet
  vnpayParams = sortObject(vnpayParams);

  // Tạo chuỗi mã hóa
  const signData = new URLSearchParams(vnpayParams).toString();
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // Xác thực chữ ký
  if (vnp_SecureHash === signed) {
    const orderId = vnpayParams['vnp_TxnRef'];
    const responseCode = vnpayParams['vnp_ResponseCode'];

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found in DB');
    }

    if (responseCode === '00') {
      // Thanh toán thành công!
      order.payment_status = 'paid';
      await order.save();
      return { success: true, message: 'Thanh toán trọn vẹn', orderId };
    } else {
      // Khách hàng hủy hoặc thẻ lỗi
      order.status = 'cancelled';
      await order.save();
      return {
        success: false,
        message: 'Thanh toán thất bại hoặc đã hủy',
        orderId,
      };
    }
  } else {
    throw new Error('Invalid Checksum (Tấn công mạng/VNPAY URL mạo danh)');
  }
};

export default vnpayReturnService;
