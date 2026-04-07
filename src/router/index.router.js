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

export default router;
