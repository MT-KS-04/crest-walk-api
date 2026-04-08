/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getRevenueService from '../../../service/admin/stats/getRevenue.service.js';

const getRevenue = async (req, res) => {
  try {
    const data = await getRevenueService(req.query);

    res.status(200).json({
      message: 'Revenue statistics fetched successfully',
      data,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error fetching revenue statistics', error);
  }
};

export default getRevenue;
