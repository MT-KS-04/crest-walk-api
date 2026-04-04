/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Models
 */
import User from '../model/user.model';

const authorize = (roles = []) => {
  return async (req, res, next) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User nod found ',
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions',
        });
        return;
      }

      return next();
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: error,
      });

      logger.error('Error while authorizing user', error);
    }
  };
};

export default authorize;
