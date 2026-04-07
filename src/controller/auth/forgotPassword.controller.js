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
import forgotPasswordService from '../../service/auth/forgotPassword.service.js';

/**
 * Controller to handle forgot password requests.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);

    res.status(200).json({
      code: 'Success',
      message: 'Reset password link has been sent to your email',
    });

    logger.info('Forgot password email request handled successfully', {
      email,
    });
  } catch (error) {
    if (error.code === 'NotFound') {
      return res.status(404).json({
        code: 'NotFound',
        message: error.message,
      });
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error in forgotPassword controller:', error);
  }
};

export default forgotPassword;
