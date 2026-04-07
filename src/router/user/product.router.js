/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import searchController from '../../controller/user/product/search.controller.js';
import filterController from '../../controller/user/product/filter.controller.js';

const router = Router();

router.get('/search', searchController);
router.get('/filter', filterController);

export default router;
