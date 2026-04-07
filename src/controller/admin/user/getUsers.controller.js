/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getUsersService from '../../../service/admin/user/getUsers.service.js';

const getUsers = async (req, res) => {
  try {
    const data = await getUsersService(req.query);

    res.status(200).json({
      message: 'Users retrieved successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting users', error);
  }
};

export default getUsers;
