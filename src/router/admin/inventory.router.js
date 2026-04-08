/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import getInventory from '../../controller/admin/inventory/getInventory.controller.js';
import updateStock from '../../controller/admin/inventory/updateStock.controller.js';

const router = Router();

// Lấy danh sách tồn kho
router.get(
  '/',
  query('lowStock')
    .optional()
    .isBoolean()
    .withMessage('lowStock must be a boolean'),
  validationError,
  getInventory,
);

// Cập nhật nhanh số lượng tồn kho theo Size
router.patch(
  '/:productId/size/:size',
  param('productId').isMongoId().withMessage('Invalid Product ID'),
  param('size').isNumeric().withMessage('Size must be a number'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isNumeric()
    .withMessage('Quantity must be a number'),
  body('mode')
    .optional()
    .isIn(['set', 'inc'])
    .withMessage('Mode must be either set or inc'),
  validationError,
  updateStock,
);

export default router;
