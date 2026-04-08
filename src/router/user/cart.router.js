/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import addController from '../../controller/user/cart/add.controller.js';
import getController from '../../controller/user/cart/get.controller.js';
import updateController from '../../controller/user/cart/update.controller.js';
import removeController from '../../controller/user/cart/remove.controller.js';

const router = Router();

router.get('/', getController);
router.post('/add', addController);
router.put('/update', updateController);
router.delete('/remove', removeController);

export default router;
