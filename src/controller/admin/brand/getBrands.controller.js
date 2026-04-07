/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getBrandsService from '../../../service/admin/brand/getBrands.service.js';

const getBrands = async (req, res) => {
  try {
    const brands = await getBrandsService();

    res.status(200).json({
      message: 'Brands retrieved successfully',
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting brands', error);
  }
};

export default getBrands;
