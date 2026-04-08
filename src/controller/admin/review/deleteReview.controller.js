/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteReviewService from '../../../service/admin/review/deleteReview.service.js';

const deleteReview = async (req, res) => {
  try {
    const response = await deleteReviewService(req.params.id);

    res.status(200).json({
      message: response.message,
    });

    logger.info('Review deleted by admin', { reviewId: req.params.id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: 'NotFound',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error deleting review', error);
  }
};

export default deleteReview;
