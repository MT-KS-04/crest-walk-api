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

import config from '../../../config/env.config.js';

// CẤU HÌNH VNPAY MẶC ĐỊNH
export const VNPAY_CONFIG = {
    vnp_TmnCode: config.VNPAY_TMN_CODE, 
    vnp_HashSecret: config.VNPAY_HASH_SECRET,
    vnp_Url: config.VNPAY_URL,
    vnp_ReturnUrl: config.VNPAY_RETURN_URL
};
