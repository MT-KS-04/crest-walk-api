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
 * Utils
 */
import { genUsername } from '../../utils/index.utils.js';

/**
 * Lib
 */
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt.js';
import logger from '../../lib/winston.js';

const registerService = async (data) => {
  const username = genUsername();
  const newUser = await User.create({ ...data, username });

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  await Token.create({ token: refreshToken, userId: newUser._id });

  logger.info('Refresh token create for new user', {
    userId: newUser._id,
    token: refreshToken,
  });

  return {
    newUser,
    accessToken,
    refreshToken,
  };
};

export default registerService;
