/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateProductService from '../../../service/admin/product/updateProduct.service.js';

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await updateProductService(req.params.id, req.body);

    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });

    logger.info(`Product updated: ${req.params.id}`);
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

    logger.error(`Error updating product: ${req.params.id}`, error);
  }
};

export default updateProduct;
