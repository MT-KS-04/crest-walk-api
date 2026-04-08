/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Review from '../../../model/review.model.js';

const getReviewByIdService = async (id) => {
  const review = await Review.findById(id)
    .populate('user_id', 'email first_name last_name avatar')
    .populate('product_id', 'name slug thumbnail');

  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return review;
};

export default getReviewByIdService;
