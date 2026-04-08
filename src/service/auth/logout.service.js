/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Token from '../../model/token.model.js';

/**
 * Thu hồi refresh token trong DB (nếu có).
 * @param {string | undefined} refreshTokenValue — JWT refresh từ cookie
 * @returns {{ removed: boolean }}
 */
const logoutService = async (refreshTokenValue) => {
  if (!refreshTokenValue || typeof refreshTokenValue !== 'string') {
    return { removed: false };
  }

  const result = await Token.deleteOne({ token: refreshTokenValue }).exec();
  return { removed: result.deletedCount > 0 };
};

export default logoutService;
