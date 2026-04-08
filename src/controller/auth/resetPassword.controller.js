/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../lib/winston.js';
import resetPasswordService from '../../service/auth/resetPassword.service.js';

const resetPassword = async (req, res) => {
  try {
    await resetPasswordService(req.body.token, req.body.newPassword);

    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error resetting password', error);
  }
};

export default resetPassword;
