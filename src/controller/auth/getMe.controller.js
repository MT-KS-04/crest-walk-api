/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import logger from '../../lib/winston.js';

/**
 * Models
 */
import User from '../../model/user.model.js';

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-__v').lean().exec();

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while getting current user', error);
  }
};

export default getCurrentUser;
