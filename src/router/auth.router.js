/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Moduels
 */
import { Router } from 'express';
import { body, cookie } from 'express-validator';

/**
 * Custom Moduels
 */
import User from '../model/user.model.js';
import validationError from '../middleware/validationError.js';

/**
 * Controllers
 */
import register from '../controller/auth/register.controller.js';

const router = Router();

router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('Email already in use');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 20 characters long'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  register,
);

export default router;
