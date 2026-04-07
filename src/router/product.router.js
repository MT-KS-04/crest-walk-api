/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import searchController from '../controller/product/search.controller.js';

const router = Router();

router.get('/search', searchController);

export default router;
