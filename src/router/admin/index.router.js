/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';

import productRouter from './product.router.js';

const router = Router();

// Routes
router.use('/products', productRouter);

export default router;
