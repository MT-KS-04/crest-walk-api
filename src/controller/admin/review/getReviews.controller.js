/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getReviewsService from '../../../service/admin/review/getReviews.service.js';

const getReviews = async (req, res) => {
  try {
    const data = await getReviewsService(req.query);

    res.status(200).json({
      message: 'Reviews fetched successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error fetching reviews', error);
  }
};

export default getReviews;
