/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import createCategory from '../../controller/admin/category/createCategory.controller.js';
import getCategories from '../../controller/admin/category/getCategories.controller.js';
import getCategoryById from '../../controller/admin/category/getCategoryById.controller.js';
import updateCategory from '../../controller/admin/category/updateCategory.controller.js';
import deleteCategory from '../../controller/admin/category/deleteCategory.controller.js';

const router = Router();

// Lấy danh sách danh mục
router.get('/', getCategories);

// Thêm mới danh mục
router.post(
  '/',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Slug must be less than 50 characters')
    .custom((value) => {
      if (value && /[^a-z0-9-]/.test(value)) {
        throw new Error(
          'Slug can only contain lowercase letters, numbers, and hyphens',
        );
      }
      return true;
    }),
  validationError,
  createCategory,
);

// Lấy chi tiết danh mục
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Category ID'),
  validationError,
  getCategoryById,
);

// Cập nhật danh mục
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Category ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Slug must be less than 50 characters')
    .custom((value) => {
      if (value && /[^a-z0-9-]/.test(value)) {
        throw new Error(
          'Slug can only contain lowercase letters, numbers, and hyphens',
        );
      }
      return true;
    }),
  validationError,
  updateCategory,
);

// Xóa danh mục
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Category ID'),
  validationError,
  deleteCategory,
);

export default router;
