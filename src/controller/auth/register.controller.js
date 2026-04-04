/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 *  Custom moduels
 */
import logger from '../../lib/winston.js';
import config from '../../config/env.config.js';

/**
 * Services
 */
import registerService from '../../service/auth/register.service.js';

const register = async (req, res) => {
  try {
    const { newUser, accessToken, refreshToken } = await registerService(
      req.body,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        username: newUser.username,
        full_name: newUser.full_name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User register successfully', newUser);
  } catch (error) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Error during register user',
    });

    logger.error('Error during register user', error);
  }
};

export default register;
