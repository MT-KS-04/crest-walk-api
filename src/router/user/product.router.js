/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import getProductsController from '../../controller/user/product/getProducts.controller.js';
import searchController from '../../controller/user/product/search.controller.js';
import filterController from '../../controller/user/product/filter.controller.js';
import getProductByIdController from '../../controller/user/product/getProductById.controller.js';

const router = Router();

router.get('/', getProductsController);
router.get('/search', searchController);
router.get('/filter', filterController);
router.get('/:id', getProductByIdController);

export default router;
