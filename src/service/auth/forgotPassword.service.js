/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Models
 */
import User from '../../model/user.model.js';

/**
 * Utils
 */
import { genResetToken } from '../../utils/index.utils.js';

/**
 * Lib
 */
import { sendResetPasswordEmail } from '../../lib/nodemailer.js';
import logger from '../../lib/winston.js';

/**
 * Handles the forgot password request.
 * @param {string} email - The user's email address.
 * @returns {Promise<void>}
 */
const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('No user found with this email');
    error.code = 'NotFound';
    throw error;
  }

  const resetToken = genResetToken();
  const resetExpires = Date.now() + 3600000; // 1 hour

  user.password_reset_token = resetToken;
  user.password_reset_expires = resetExpires;
  await user.save();

  logger.info(`Generated reset token for user: ${email}`);

  try {
    await sendResetPasswordEmail(email, resetToken);
  } catch (error) {
    // If email fails, clear the token to be safe
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();
    throw error;
  }
};

export default forgotPasswordService;
