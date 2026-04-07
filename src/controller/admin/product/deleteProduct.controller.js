/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteProductService from '../../../service/admin/product/deleteProduct.service.js';

const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    res.status(200).json({
      message: 'Product deleted successfully',
      data: null,
    });

    logger.info(`Product deleted: ${req.params.id}`);
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

    logger.error(`Error deleting product: ${req.params.id}`, error);
  }
};

export default deleteProduct;
