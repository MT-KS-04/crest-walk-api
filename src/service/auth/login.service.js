/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Models
 */
import User from '../../model/user.model.js';
import Token from '../../model/token.model.js';

/**
 * Lib
 */
import logger from '../../lib/winston.js';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt.js';

const loginService = async (data) => {
  const user = await User.findOne({ email: data.email })
    .select('username full_name email role status')
    .lean()
    .exec();

  if (!user) {
    throw new Error('User not found');
  }

  if (user.status === 'blocked') {
    const error = new Error(
      'Your account has been blocked. Please contact support.',
    );
    error.code = 'AccountSuspended';
    error.statusCode = 403;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Token.create({ token: refreshToken, userId: user._id });

  logger.info('Refresh token for user login', {
    userId: user._id,
    token: refreshToken,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export default loginService;
