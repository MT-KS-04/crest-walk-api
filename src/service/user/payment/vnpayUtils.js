/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import crypto from 'crypto';

export const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

export const getVnpTime = () => {
    const date = new Date();
    // Chuyển sang giờ VN (UTC+7)
    const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        ...options
    });
    
    // Format: MM/DD/YYYY, HH:mm:ss
    const parts = formatter.formatToParts(date);
    const dateObj = {};
    for (const { type, value } of parts) {
        dateObj[type] = value;
    }
    
    const { year, month, day, hour, minute, second } = dateObj;
    return `${year}${month}${day}${hour}${minute}${second}`;
};

// CẤU HÌNH VNPAY MẶC ĐỊNH (Sửa lại bằng key thật từ sandbox vnpay web)
export const VNPAY_CONFIG = {
    vnp_TmnCode: 'YOUR_TMN_CODE', // Cần lấy trên web
    vnp_HashSecret: 'YOUR_HASH_SECRET', // Cần lấy trên web
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'http://localhost:3000/api/v1/payment/vnpay_return'
};
