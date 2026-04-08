/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import pkg from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = pkg;

/**
 *  Lib
 */
import { verifyRefreshToken, generateAccessToken } from '../../lib/jwt.js';

/**
 * Models
 */
import Token from '../../model/token.model.js';

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const tokenExits = await Token.exists({ token: refreshToken });

    if (!tokenExits) {
      res.status(404).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }
    // Verify Refresh Token
    const jwtPayload = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during refresh token', error);
  }
};

export default refreshToken;
