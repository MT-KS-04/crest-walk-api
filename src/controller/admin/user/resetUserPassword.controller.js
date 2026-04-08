/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import resetUserPasswordService from '../../../service/admin/user/resetUserPassword.service.js';

const resetUserPassword = async (req, res) => {
  try {
    await resetUserPasswordService(req.params.id, req.body.newPassword);

    res.status(200).json({
      message: 'User password reset successfully',
      data: null,
    });

    logger.info(
      `Password reset for user: ${req.params.id} by admin: ${req.userId}`,
    );
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'Error',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error resetting password for user: ${req.params.id}`, error);
  }
};

export default resetUserPassword;
