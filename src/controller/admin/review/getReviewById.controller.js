/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getReviewByIdService from '../../../service/admin/review/getReviewById.service.js';

const getReviewById = async (req, res) => {
  try {
    const review = await getReviewByIdService(req.params.id);

    res.status(200).json({
      message: 'Review fetched successfully',
      data: review,
    });
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

    logger.error('Error fetching review', error);
  }
};

export default getReviewById;
