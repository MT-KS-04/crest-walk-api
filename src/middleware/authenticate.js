/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node moduels
 */
import pkg from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = pkg;

/**
 * Custom Moduels
 */
import logger from '../lib/winston.js';
import User from '../model/user.model.js';

/**
 * Custom Lib
 */
import { verifyAccessToken } from '../lib/jwt.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      code: 'Unauthorized',
      message: 'Authorization header is missing or invalid',
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'Authentication Error',
      message: 'Access denied, no token provide',
    });
    return;
  }

  const [_, token] = authHeader.split(' ');

  try {
    const jwtPayload = verifyAccessToken(token);

    req.userId = jwtPayload.userId;

    // Check if user is blocked
    const user = await User.findById(jwtPayload.userId)
      .select('status')
      .lean()
      .exec();

    if (!user) {
      return res.status(401).json({
        code: 'AuthenticationError',
        message: 'User account no longer exists',
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        code: 'Forbidden',
        message: 'Your account has been blocked. Please contact support.',
      });
    }

    req.userId = jwtPayload.userId;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during authentication ', error);
  }
};

export default authenticate;
