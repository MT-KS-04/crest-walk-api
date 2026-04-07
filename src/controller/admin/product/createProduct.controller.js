/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import createProductService from '../../../service/admin/product/createProduct.service.js';

const createProduct = async (req, res) => {
  try {
    const newProduct = await createProductService(req.body);

    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct,
    });

    logger.info('Product created', { productId: newProduct._id });
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

    logger.error('Error creating product', error);
  }
};

export default createProduct;
