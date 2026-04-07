/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import nodemailer from 'nodemailer';

/**
 * Custom Modules
 */
import config from '../config/env.config.js';
import logger from './winston.js';

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

/**
 * Sends a reset password email.
 * @param {string} to - The recipient's email address.
 * @param {string} resetToken - The reset password token.
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to, resetToken) => {
  const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Crest Walk Support" <${config.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password - Crest Walk',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p>Hi,</p>
        <p>You requested to reset your password for your Crest Walk account. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br/>The Crest Walk Team</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If the button doesn't work, copy and paste this link into your browser: <br/> ${resetLink}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Reset password email sent to: ${to}`);
  } catch (error) {
    logger.error(`Error sending reset password email to ${to}:`, error);
    throw new Error('Failed to send reset password email');
  }
};
