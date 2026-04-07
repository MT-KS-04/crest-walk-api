/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getProductsService from '../../../service/admin/product/getProducts.service.js';

const getProducts = async (req, res) => {
  try {
    const data = await getProductsService(req.query);

    res.status(200).json({
      message: 'Products retrieved successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting products', error);
  }
};

export default getProducts;
