/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import getReviews from '../../controller/admin/review/getReviews.controller.js';
import getReviewById from '../../controller/admin/review/getReviewById.controller.js';
import updateReviewStatus from '../../controller/admin/review/updateReviewStatus.controller.js';
import deleteReview from '../../controller/admin/review/deleteReview.controller.js';

const router = Router();

// Lấy danh sách đánh giá
router.get(
  '/',
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved or rejected'),
  query('productId').optional().isMongoId().withMessage('Invalid Product ID'),
  query('userId').optional().isMongoId().withMessage('Invalid User ID'),
  validationError,
  getReviews,
);

// Lấy chi tiết đánh giá
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Review ID'),
  validationError,
  getReviewById,
);

// Duyệt / Từ chối đánh giá
router.put(
  '/:id/status',
  param('id').isMongoId().withMessage('Invalid Review ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved or rejected'),
  validationError,
  updateReviewStatus,
);

// Xóa đánh giá (xóa hẳn)
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Review ID'),
  validationError,
  deleteReview,
);

export default router;
