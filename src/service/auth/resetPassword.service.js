/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import crypto from 'crypto';
import bcrypt from 'bcrypt';

import User from '../../model/user.model.js';
import PasswordResetToken from '../../model/passwordResetToken.model.js';

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const resetPasswordService = async (token, newPassword) => {
  const now = new Date();
  const tokenHash = hashToken(token);

  const usedToken = await PasswordResetToken.findOneAndUpdate(
    {
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: now },
    },
    { $set: { usedAt: now } },
    { new: true },
  )
    .select('userId')
    .lean()
    .exec();

  if (!usedToken) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { _id: usedToken.userId },
    { $set: { password: passwordHash } },
    { runValidators: true },
  ).exec();

  await PasswordResetToken.deleteMany({ userId: usedToken.userId }).exec();
};

export default resetPasswordService;
