/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import createBrandService from '../../../service/admin/brand/createBrand.service.js';

const createBrand = async (req, res) => {
  try {
    const newBrand = await createBrandService(req.body);

    res.status(201).json({
      message: 'Brand created successfully',
      data: newBrand,
    });

    logger.info('Brand created', { brandId: newBrand._id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 409 ? 'Conflict' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error creating brand', error);
  }
};

export default createBrand;
