/**
 * Gắn req.userId nếu có Bearer token hợp lệ; không token hoặc lỗi JWT thì vẫn next() (khách).
 */
import pkg from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = pkg;

import { verifyAccessToken } from '../lib/jwt.js';

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const jwtPayload = verifyAccessToken(token);
    req.userId = jwtPayload.userId;
  } catch (e) {
    if (e instanceof TokenExpiredError || e instanceof JsonWebTokenError) {
      req.userId = undefined;
    }
  }
  next();
};

export default optionalAuthenticate;
