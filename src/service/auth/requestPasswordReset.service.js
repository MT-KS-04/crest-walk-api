/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import crypto from 'crypto';

import User from '../../model/user.model.js';
import PasswordResetToken from '../../model/passwordResetToken.model.js';
import logger from '../../lib/winston.js';
import { sendPasswordResetEmail } from '../../lib/emailSender.js';

const parseDurationToMs = (value) => {
  if (value === undefined || value === null || value === '') return null;

  const raw = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(raw)) {
    return Number(raw) * 1000;
  }

  const match = raw.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d|w|y)$/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const requestPasswordResetService = async (email) => {
  const exposeToken =
    process.env.PASSWORD_RESET_EXPOSE_TOKEN === 'true' &&
    process.env.NODE_ENV !== 'production';

  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .trim()
    .replace(/\/+$/, '');

  const user = await User.findOne({ email })
    .select('_id email status')
    .lean()
    .exec();

  if (!user || user.status === 'blocked') {
    return;
  }

  await PasswordResetToken.deleteMany({ userId: user._id });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);

  const expiryMs =
    parseDurationToMs(process.env.PASSWORD_RESET_TOKEN_EXPIRY) ??
    parseDurationToMs('15m');

  const expiresAt = new Date(Date.now() + expiryMs);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(
    rawToken,
  )}`;

  if (process.env.NODE_ENV !== 'production') {
    logger.info('Password reset link generated', { to: user.email, resetUrl });
  }

  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  } catch (error) {
    logger.error('Failed to send password reset email', error);
  }

  if (!exposeToken) return;
  return { resetToken: rawToken, resetUrl };
};

export default requestPasswordResetService;
