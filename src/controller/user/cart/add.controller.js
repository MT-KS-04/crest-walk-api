/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import addService from '../../../service/user/cart/add.service.js';

const add = async (req, res) => {
  try {
    const cart = await addService(req.userId, req.body);

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Product added to cart successfully',
    });

    logger.info('Product added to cart successfully', {
      userId: req.userId,
      payload: req.body,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code:
        status === 400
          ? 'BadRequest'
          : status === 404
            ? 'NotFound'
            : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error adding to cart', error);
  }
};

export default add;
