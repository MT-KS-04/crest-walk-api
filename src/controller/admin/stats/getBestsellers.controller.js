/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getBestsellersService from '../../../service/admin/stats/getBestsellers.service.js';

const getBestsellers = async (req, res) => {
  try {
    const data = await getBestsellersService(req.query);

    res.status(200).json({
      message: 'Best-selling products fetched successfully',
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

    logger.error('Error fetching bestsellers', error);
  }
};

export default getBestsellers;
