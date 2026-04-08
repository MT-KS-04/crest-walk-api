/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Review from '../../../model/review.model.js';

const deleteReviewService = async (id) => {
  const review = await Review.findById(id);

  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  await Review.findByIdAndDelete(id);

  return { message: 'Review deleted successfully' };
};

export default deleteReviewService;
