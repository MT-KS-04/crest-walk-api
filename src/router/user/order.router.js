/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import checkoutController from '../../controller/user/order/checkout.controller.js';
import historyController from '../../controller/user/order/history.controller.js';
import detailController from '../../controller/user/order/detail.controller.js';

const router = Router();

router.post('/checkout', checkoutController);
router.get('/', historyController);
router.get('/:id', detailController);

export default router;
