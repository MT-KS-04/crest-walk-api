/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import config from '../config/env.config.js';

/**
 * Middlewares
 */
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

/**
 * Routers
 */
import authRouter from './auth.router.js';
import adminRouter from './admin/index.router.js';
import productRouter from './user/product.router.js';
import cartRouter from './user/cart.router.js';
import orderRouter from './user/order.router.js';
import wishlistRouter from './user/wishlist.router.js';
import paymentRouter from './user/payment.router.js';
import reviewRouter from './user/review.router.js';

const router = Router();

/**
 * Root API
 */
router.get('/', (req, res) => {
  res.json({
    message: 'API is live',
    status: 'ok',
    serviceName: 'crest-walk-api',
    version: '1.0.0',
    environment: config.NODE_ENV || 'development',
    uptime: process.uptime(),
    server: 'Express + Node.js',
    docs: 'https://docs.crest-walk-api.mk-ts-04.com',
    timestamp: new Date().toISOString(),
  });
});

// Init Router
router.use('/auth', authRouter);
router.use('/admin', authenticate, authorize(['admin']), adminRouter);
router.use('/products', productRouter);
router.use('/cart', authenticate, cartRouter);
router.use('/orders', authenticate, orderRouter);
router.use('/wishlist', authenticate, wishlistRouter);
router.use('/payment', paymentRouter);
router.use('/reviews', reviewRouter); // Middleware authenticate sẽ kẹp sau lưng từng cái nhỏ bên trong tùy tình huống

export default router;
