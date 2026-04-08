/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import checkoutController from '../../controller/user/order/checkout.controller.js';

const router = Router();

router.post('/checkout', checkoutController);

export default router;
