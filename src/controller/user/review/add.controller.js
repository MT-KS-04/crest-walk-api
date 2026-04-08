/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import addService from '../../../service/user/review/add.service.js';

const add = async (req, res) => {
  try {
    const review = await addService(req.userId, req.body);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted and is awaiting approval.',
    });

    logger.info('Review submitted successfully', {
      userId: req.userId,
      productId: req.body.product_id,
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

    logger.error('Error submitting review', error);
  }
};

export default add;
