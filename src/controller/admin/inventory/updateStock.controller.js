/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateStockService from '../../../service/admin/inventory/updateStock.service.js';

const updateStock = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const { quantity, mode } = req.body;

    const updatedProduct = await updateStockService(
      productId,
      size,
      quantity,
      mode,
    );

    res.status(200).json({
      message: 'Stock updated successfully',
      data: updatedProduct,
    });

    logger.info(
      `Stock updated for Product: ${productId}, Size: ${size}, Mode: ${mode || 'set'}, Qty: ${quantity}`,
    );
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

    logger.error('Error updating stock', error);
  }
};

export default updateStock;
