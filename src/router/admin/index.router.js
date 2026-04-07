/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';

import productRouter from './product.router.js';
import categoryRouter from './category.router.js';
import brandRouter from './brand.router.js';
import orderRouter from './order.router.js';
import userRouter from './user.router.js';
import inventoryRouter from './inventory.router.js';

const router = Router();

// Routes
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/orders', orderRouter);
router.use('/users', userRouter);
router.use('/inventory', inventoryRouter);

export default router;
