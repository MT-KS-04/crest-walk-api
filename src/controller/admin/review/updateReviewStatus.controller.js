/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateReviewStatusService from '../../../service/admin/review/updateReviewStatus.service.js';

const updateReviewStatus = async (req, res) => {
  try {
    const updatedReview = await updateReviewStatusService(
      req.params.id,
      req.body.status,
    );

    res.status(200).json({
      message: 'Review status updated successfully',
      data: updatedReview,
    });

    logger.info('Review status updated by admin', {
      reviewId: updatedReview._id,
      newStatus: req.body.status,
    });
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

    logger.error('Error updating review status', error);
  }
};

export default updateReviewStatus;
