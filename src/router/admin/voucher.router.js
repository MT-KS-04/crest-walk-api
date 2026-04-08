/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import createVoucher from '../../controller/admin/voucher/createVoucher.controller.js';
import getVouchers from '../../controller/admin/voucher/getVouchers.controller.js';
import getVoucherById from '../../controller/admin/voucher/getVoucherById.controller.js';
import updateVoucher from '../../controller/admin/voucher/updateVoucher.controller.js';
import deleteVoucher from '../../controller/admin/voucher/deleteVoucher.controller.js';

const router = Router();

// Lấy danh sách voucher
router.get('/', getVouchers);

// Lấy chi tiết voucher
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Voucher ID'),
  validationError,
  getVoucherById,
);

// Thêm mới voucher
router.post(
  '/',
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Voucher code is required')
    .isAlphanumeric()
    .withMessage('Voucher code can only contain letters and numbers')
    .isLength({ max: 20 })
    .withMessage('Voucher code must be less than 20 characters'),
  body('discount_type')
    .isIn(['percent', 'fixed'])
    .withMessage('Discount type must be either percent or fixed'),
  body('discount_amount')
    .isNumeric()
    .withMessage('Discount amount must be a number')
    .custom((value, { req }) => {
      if (req.body.discount_type === 'percent' && (value <= 0 || value > 100)) {
        throw new Error('Percent discount amount must be between 1 and 100');
      }
      if (value < 0) {
        throw new Error('Discount amount cannot be negative');
      }
      return true;
    }),
  body('min_order')
    .optional()
    .isNumeric()
    .withMessage('Minimum order must be a number'),
  body('max_uses')
    .optional()
    .isNumeric()
    .withMessage('Max uses must be a number'),
  body('start_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('end_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid date'),
  validationError,
  createVoucher,
);

// Cập nhật voucher
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Voucher ID'),
  body('code')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Voucher code is required')
    .isAlphanumeric()
    .withMessage('Voucher code can only contain letters and numbers')
    .isLength({ max: 20 })
    .withMessage('Voucher code must be less than 20 characters'),
  body('discount_type')
    .optional()
    .isIn(['percent', 'fixed'])
    .withMessage('Discount type must be either percent or fixed'),
  body('discount_amount')
    .optional()
    .isNumeric()
    .withMessage('Discount amount must be a number'),
  body('min_order')
    .optional()
    .isNumeric()
    .withMessage('Minimum order must be a number'),
  body('max_uses')
    .optional()
    .isNumeric()
    .withMessage('Max uses must be a number'),
  body('start_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('end_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),
  validationError,
  updateVoucher,
);

// Xóa voucher
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Voucher ID'),
  validationError,
  deleteVoucher,
);

export default router;
