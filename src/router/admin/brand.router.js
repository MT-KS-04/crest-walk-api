/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import createBrand from '../../controller/admin/brand/createBrand.controller.js';
import getBrands from '../../controller/admin/brand/getBrands.controller.js';
import getBrandById from '../../controller/admin/brand/getBrandById.controller.js';
import updateBrand from '../../controller/admin/brand/updateBrand.controller.js';
import deleteBrand from '../../controller/admin/brand/deleteBrand.controller.js';

const router = Router();

// Lấy danh sách thương hiệu
router.get('/', getBrands);

// Lấy chi tiết thương hiệu
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Brand ID'),
  validationError,
  getBrandById,
);

// Thêm mới thương hiệu
router.post(
  '/',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Slug must be less than 100 characters')
    .custom((value) => {
      if (value && /[^a-z0-9-]/.test(value)) {
        throw new Error(
          'Slug can only contain lowercase letters, numbers, and hyphens',
        );
      }
      return true;
    }),
  body('logo')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Logo must be a valid URL'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  validationError,
  createBrand,
);

// Cập nhật thương hiệu
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Brand ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Slug must be less than 100 characters')
    .custom((value) => {
      if (value && /[^a-z0-9-]/.test(value)) {
        throw new Error(
          'Slug can only contain lowercase letters, numbers, and hyphens',
        );
      }
      return true;
    }),
  body('logo')
    .optional({ nullable: true, checkFalsy: true }) // Accept null or empty to remove logo
    .isURL()
    .withMessage('Logo must be a valid URL'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string'),
  validationError,
  updateBrand,
);

// Xóa thương hiệu
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Brand ID'),
  validationError,
  deleteBrand,
);

export default router;
