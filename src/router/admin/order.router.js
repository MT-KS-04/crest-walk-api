/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import getOrders from '../../controller/admin/order/getOrders.controller.js';
import getOrderById from '../../controller/admin/order/getOrderById.controller.js';
import updateOrderStatus from '../../controller/admin/order/updateOrderStatus.controller.js';

const router = Router();

// Lấy danh sách đơn hàng
router.get('/', getOrders);

// Lấy chi tiết đơn hàng
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid Order ID'),
  validationError,
  getOrderById,
);

// Cập nhật trạng thái đơn hàng
router.put(
  '/:id/status',
  param('id').isMongoId().withMessage('Invalid Order ID'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'])
    .withMessage(
      'Status must be pending, confirmed, shipping, delivered or cancelled',
    ),
  body('payment_status')
    .optional()
    .isIn(['unpaid', 'paid'])
    .withMessage('Payment status must be unpaid or paid'),
  validationError,
  updateOrderStatus,
);

export default router;
