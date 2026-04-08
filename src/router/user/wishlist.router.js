/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import addController from '../../controller/user/wishlist/add.controller.js';
import getController from '../../controller/user/wishlist/get.controller.js';

const router = Router();

router.get('/', getController);
router.post('/add', addController);

export default router;
