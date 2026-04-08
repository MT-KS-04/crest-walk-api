/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Review from '../../../model/review.model.js';

const getReviewsService = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.productId) {
    filter.product_id = query.productId;
  }

  if (query.userId) {
    filter.user_id = query.userId;
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Lôi thêm thông tin cơ bản của User và Product ra để Admin đọc hiểu thay vì toàn các dãy ID
  const reviews = await Review.find(filter)
    .populate('user_id', 'email first_name last_name avatar')
    .populate('product_id', 'name slug thumbnail')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export default getReviewsService;
