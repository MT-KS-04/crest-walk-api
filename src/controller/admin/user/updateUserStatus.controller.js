/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateUserStatusService from '../../../service/admin/user/updateUserStatus.service.js';

const updateUserStatus = async (req, res) => {
  try {
    // req.userId is from authenticate middleware
    const updatedUser = await updateUserStatusService(
      req.userId,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });

    logger.info(
      `User status/role updated for: ${req.params.id} by admin: ${req.userId}`,
    );
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error updating user status: ${req.params.id}`, error);
  }
};

export default updateUserStatus;
