/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import vnpayReturnController from '../../controller/user/payment/vnpayReturn.controller.js';

const router = Router();

// VNPAY return route
router.get('/vnpay_return', vnpayReturnController);

export default router;
