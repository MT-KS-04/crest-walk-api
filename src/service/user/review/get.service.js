/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Review from '../../../model/review.model.js';
import Product from '../../../model/product.model.js';

const getService = async (productId) => {
  // 1. Kiểm tra giày có tồn tại
  const productExists = await Product.exists({ _id: productId });
  if (!productExists) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }

  // 2. Tìm tất cả bình luận có liên kết với sản phẩm & CHỈ LẤY những bình luận Admin đã duyệt 'approved'
  const reviews = await Review.find({
    product_id: productId,
    status: 'approved',
  })
    .populate('user_id', 'username email avatar') // Hiển thị thông tin cơ bản của người gửi
    .sort({ createdAt: -1 }) // Lấy đánh giá mới nhất lên đầu
    .lean();

  return reviews;
};

export default getService;
