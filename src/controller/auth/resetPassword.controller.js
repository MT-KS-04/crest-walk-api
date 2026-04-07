/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Moduels
 */
import logger from '../../lib/winston.js';

/**
 * Service
 */
import resetPasswordService from '../../service/auth/resetPassword.service.js';

/**
 * Controller to handle reset password requests.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await resetPasswordService(token, password);

    res.status(200).json({
      code: 'Success',
      message: 'Password reset successfully',
    });

    logger.info('Reset password handled successfully');
  } catch (error) {
    if (error.code === 'Unauthorized') {
      return res.status(401).json({
        code: 'Unauthorized',
        message: error.message,
      });
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error in resetPassword controller:', error);
  }
};

export default resetPassword;
