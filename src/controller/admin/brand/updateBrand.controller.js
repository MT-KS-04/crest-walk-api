/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateBrandService from '../../../service/admin/brand/updateBrand.service.js';

const updateBrand = async (req, res) => {
  try {
    const updatedBrand = await updateBrandService(req.params.id, req.body);

    res.status(200).json({
      message: 'Brand updated successfully',
      data: updatedBrand,
    });

    logger.info(`Brand updated: ${req.params.id}`);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code:
          error.statusCode === 404
            ? 'NotFound'
            : error.statusCode === 409
              ? 'Conflict'
              : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error updating brand: ${req.params.id}`, error);
  }
};

export default updateBrand;
