/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Review from '../../../model/review.model.js';
import Product from '../../../model/product.model.js';

const addService = async (userId, payload) => {
  const { product_id, rating, comment } = payload;

  if (!product_id || !rating) {
    const err = new Error('Product ID and Rating are required');
    err.status = 400;
    throw err;
  }

  // 1. Kiểm tra sản phẩm có tồn tại không
  const productExists = await Product.exists({ _id: product_id });
  if (!productExists) {
    const err = new Error('Product does not exist');
    err.status = 404;
    throw err;
  }

  // 2. Chống spam: Tránh việc 1 User đánh giá 1 đôi giày quá 1 lần
  const existingReview = await Review.findOne({
    user_id: userId,
    product_id: product_id,
  });
  if (existingReview) {
    // Nếu họ có đánh giá rồi thì cho phép sửa đánh giá luôn thay vì chặn
    existingReview.rating = rating;
    existingReview.comment = comment || existingReview.comment;
    existingReview.status = 'pending'; // Khi sửa xong phải đưa về trạng thái chờ Admin duyệt lại mới gắt
    await existingReview.save();
    return existingReview;
  }

  // 3. Nếu chưa đánh giá thì tạo mới
  const newReview = new Review({
    user_id: userId,
    product_id: product_id,
    rating: rating,
    comment: comment || '',
    status: 'pending', // Mặc định phải chờ duyệt
  });

  await newReview.save();
  return newReview;
};

export default addService;
