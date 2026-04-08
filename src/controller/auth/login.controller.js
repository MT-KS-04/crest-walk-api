/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Moduels
 */
import logger from '../../lib/winston.js';
import config from '../../config/env.config.js';

/**
 * Service
 */
import loginService from '../../service/auth/login.service.js';

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info('User login successfully', user);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Internal Server Error', error);
  }
};

export default login;
