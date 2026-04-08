/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../lib/winston.js';
import config from '../../config/env.config.js';
import logoutService from '../../service/auth/logout.service.js';

/** Phải khớp tùy chọn cookie khi set (login/register) để trình duyệt xóa cookie đúng */
const refreshCookieBaseOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'strict',
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    await logoutService(refreshToken);

    res.clearCookie('refreshToken', {
      ...refreshCookieBaseOptions,
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default logout;
