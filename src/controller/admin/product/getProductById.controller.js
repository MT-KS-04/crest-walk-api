/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getProductByIdService from '../../../service/admin/product/getProductById.service.js';

const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product,
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

    logger.error(`Error getting product by id: ${req.params.id}`, error);
  }
};

export default getProductById;
