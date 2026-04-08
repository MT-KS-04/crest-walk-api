/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { query } from 'express-validator';
import validationError from '../../middleware/validationError.js';

// Controllers
import getRevenue from '../../controller/admin/stats/getRevenue.controller.js';

const router = Router();

// Lấy thống kê doanh thu
router.get(
  '/revenue',
  query('interval')
    .optional()
    .isIn(['day', 'month', 'year'])
    .withMessage('Interval must be day, month, or year'),
  query('startDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date')
    .custom((value, { req }) => {
      if (
        req.query.startDate &&
        value &&
        new Date(req.query.startDate) > new Date(value)
      ) {
        throw new Error('End date must be greater than or equal to start date');
      }
      return true;
    }),
  validationError,
  getRevenue,
);

export default router;
