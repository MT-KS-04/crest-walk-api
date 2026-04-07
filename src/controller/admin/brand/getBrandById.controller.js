/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getBrandByIdService from '../../../service/admin/brand/getBrandById.service.js';

const getBrandById = async (req, res) => {
  try {
    const brand = await getBrandByIdService(req.params.id);

    res.status(200).json({
      message: 'Brand retrieved successfully',
      data: brand,
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

    logger.error(`Error getting brand by id: ${req.params.id}`, error);
  }
};

export default getBrandById;
