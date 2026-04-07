/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';

import productRouter from './product.router.js';
import categoryRouter from './category.router.js';

const router = Router();

// Routes
router.use('/products', productRouter);
router.use('/categories', categoryRouter);

export default router;
