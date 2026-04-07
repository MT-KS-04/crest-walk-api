/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteBrandService from '../../../service/admin/brand/deleteBrand.service.js';

const deleteBrand = async (req, res) => {
  try {
    await deleteBrandService(req.params.id);

    res.status(200).json({
      message: 'Brand deleted successfully',
      data: null,
    });

    logger.info(`Brand deleted: ${req.params.id}`);
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

    logger.error(`Error deleting brand: ${req.params.id}`, error);
  }
};

export default deleteBrand;
