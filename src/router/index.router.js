/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import config from '../config/env.config.js';

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

export default router;
