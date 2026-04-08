/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGOOSE_URL: process.env.MONGOOSE_URL,
  LOG_LEVELS: process.env.LOG_LEVELS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE || '2QXZ9CQ7',
  VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET || 'UZWPKLOHYVRNMTYRQZOYZRWYVMMPSMBG',
  VNPAY_URL: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/v1/payment/vnpay_return',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
};

export default config;
