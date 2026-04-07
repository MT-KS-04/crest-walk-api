/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Models
 */
import User from '../../model/user.model.js';

/**
 * Lib
 */
import logger from '../../lib/winston.js';

/**
 * Handles the reset password process.
 * @param {string} token - The reset password token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<void>}
 */
const resetPasswordService = async (token, newPassword) => {
  const user = await User.findOne({
    password_reset_token: token,
    password_reset_expires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.code = 'Unauthorized';
    throw error;
  }

  // Update password
  user.password = newPassword;
  user.password_reset_token = null;
  user.password_reset_expires = null;
  await user.save();

  logger.info(`Password reset successfully for user: ${user.email}`);
};

export default resetPasswordService;
