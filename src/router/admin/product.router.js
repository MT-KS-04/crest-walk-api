/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers will be imported here
import createProduct from '../../controller/admin/product/createProduct.controller.js';
import getProducts from '../../controller/admin/product/getProducts.controller.js';
import getProductById from '../../controller/admin/product/getProductById.controller.js';
import updateProduct from '../../controller/admin/product/updateProduct.controller.js';
import deleteProduct from '../../controller/admin/product/deleteProduct.controller.js';

const router = Router();

// Lấy danh sách sản phẩm
router.get('/', getProducts);

// Thêm mới sản phẩm
router.post(
  '/',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 150 })
    .withMessage('Name must refer to 150 characters'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('category_id').isMongoId().withMessage('Invalid Category ID'),
  body('brand_id').isMongoId().withMessage('Invalid Brand ID'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  validationError,
  createProduct,
);

// Lấy chi tiết sản phẩm
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Product ID'),
  validationError,
  getProductById,
);

// Cập nhật sản phẩm
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Product ID'),
  // Add other field validations similar to post as optional
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 150 })
    .withMessage('Name must refer to 150 characters'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('category_id').optional().isMongoId().withMessage('Invalid Category ID'),
  body('brand_id').optional().isMongoId().withMessage('Invalid Brand ID'),
  validationError,
  updateProduct,
);

// Xóa sản phẩm
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Product ID'),
  validationError,
  deleteProduct,
);

export default router;
