/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../lib/winston.js';
import requestPasswordResetService from '../../service/auth/requestPasswordReset.service.js';

const requestPasswordReset = async (req, res) => {
  try {
    const exposeToken =
      process.env.PASSWORD_RESET_EXPOSE_TOKEN === 'true' &&
      process.env.NODE_ENV !== 'production';

    const data = await requestPasswordResetService(req.body.email);

    const response = {
      message: 'If the email exists, a reset link has been sent.',
    };

    if (exposeToken && data?.resetToken && data?.resetUrl) {
      response.resetToken = data.resetToken;
      response.resetUrl = data.resetUrl;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error requesting password reset', error);
  }
};

export default requestPasswordReset;
