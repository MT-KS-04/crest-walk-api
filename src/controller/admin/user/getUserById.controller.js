/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getUserByIdService from '../../../service/admin/user/getUserById.service.js';

const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'Error',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error getting user by id: ${req.params.id}`, error);
  }
};

export default getUserById;
