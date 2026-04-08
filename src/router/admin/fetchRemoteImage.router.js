/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import { body } from 'express-validator';
import validationError from '../../middleware/validationError.js';
import fetchRemoteImage from '../../controller/admin/fetchRemoteImage.controller.js';

const router = Router();

router.post(
  '/',
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ require_protocol: true })
    .withMessage('Invalid URL'),
  validationError,
  fetchRemoteImage,
);

export default router;
