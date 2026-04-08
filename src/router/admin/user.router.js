/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import getUsers from '../../controller/admin/user/getUsers.controller.js';
import getUserById from '../../controller/admin/user/getUserById.controller.js';
import updateUserStatus from '../../controller/admin/user/updateUserStatus.controller.js';
import resetUserPassword from '../../controller/admin/user/resetUserPassword.controller.js';

const router = Router();

// Lấy danh sách người dùng
router.get('/', getUsers);

// Lấy chi tiết người dùng
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid User ID'),
  validationError,
  getUserById,
);

// Cập nhật trạng thái và vai trò
router.put(
  '/:id/status',
  param('id').isMongoId().withMessage('Invalid User ID'),
  body('status')
    .optional()
    .isIn(['active', 'blocked'])
    .withMessage('Status must be either active or blocked'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  updateUserStatus,
);

// Reset mật khẩu người dùng
router.put(
  '/:id/reset-password',
  param('id').isMongoId().withMessage('Invalid User ID'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationError,
  resetUserPassword,
);

export default router;
