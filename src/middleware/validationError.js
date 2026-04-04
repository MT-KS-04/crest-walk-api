/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Moduels
 */
import { validationResult } from 'express-validator';

const validationError = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      error: error.mapped(),
    });
    return;
  }
  next();
};

export default validationError;
