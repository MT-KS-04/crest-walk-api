/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validationError from '../../middleware/validationError.js';
import multer from 'multer';

// Controllers
import createBanner from '../../controller/admin/banner/createBanner.controller.js';
import getBanners from '../../controller/admin/banner/getBanners.controller.js';
import getBannerById from '../../controller/admin/banner/getBannerById.controller.js';
import updateBanner from '../../controller/admin/banner/updateBanner.controller.js';
import deleteBanner from '../../controller/admin/banner/deleteBanner.controller.js';

/**
 * Middleware
 */
import { uploadBannerImage } from '../../middleware/uploadImage.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Thêm ảnh URL validator
const isUrlOrPath = (value) => {
  if (!value) return true; // allow empty for optional
  // Allow normal urls and relative paths starting with /
  if (value.startsWith('/')) return true;
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

// Lấy danh sách banner
router.get(
  '/',
  query('position')
    .optional()
    .isIn(['hero', 'sidebar', 'popup'])
    .withMessage('Position must be hero, sidebar or popup'),
  query('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be boolean'),
  validationError,
  getBanners,
);

// Lấy chi tiết banner
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Banner ID'),
  validationError,
  getBannerById,
);

// Thêm mới banner
router.post(
  '/',
  upload.single('image'),
  uploadBannerImage('post'),
  body('title').trim().notEmpty().withMessage('Banner title is required'),
  body('image_url')
    .trim()
    .notEmpty()
    .withMessage('Banner image URL is required')
    .custom(isUrlOrPath)
    .withMessage('Must be a valid URL or path starting with /'),
  body('link_url')
    .optional({ checkFalsy: true })
    .trim()
    .custom(isUrlOrPath)
    .withMessage('Must be a valid URL or path starting with /'),
  body('position')
    .optional()
    .isIn(['hero', 'sidebar', 'popup'])
    .withMessage('Position must be hero, sidebar or popup'),
  body('order_index')
    .optional()
    .isNumeric()
    .withMessage('Order index must be a number'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),
  validationError,
  createBanner,
);

// Cập nhật banner
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Banner ID'),
  upload.single('image'),
  uploadBannerImage('put'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Banner title cannot be empty'),
  body('image_url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Banner image URL cannot be empty')
    .custom(isUrlOrPath)
    .withMessage('Must be a valid URL or path starting with /'),
  body('link_url')
    .optional({ checkFalsy: true })
    .trim()
    .custom(isUrlOrPath)
    .withMessage('Must be a valid URL or path starting with /'),
  body('position')
    .optional()
    .isIn(['hero', 'sidebar', 'popup'])
    .withMessage('Position must be hero, sidebar or popup'),
  body('order_index')
    .optional()
    .isNumeric()
    .withMessage('Order index must be a number'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),
  validationError,
  updateBanner,
);

// Xóa banner
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Banner ID'),
  validationError,
  deleteBanner,
);

export default router;
