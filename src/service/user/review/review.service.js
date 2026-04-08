/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Review from '../../../model/review.model.js';
import Product from '../../../model/product.model.js';
import Order from '../../../model/order.model.js';
import User from '../../../model/user.model.js';
import mongoose from 'mongoose';

const reviewService = {
  /**
   * Tạo đánh giá mới và cập nhật rating sản phẩm
   */
  create: async (userId, productId, rating, comment) => {
    // 0. Kiểm tra quyền Admin (Bypass cho testing)
    const user = await User.findById(userId);
    const isAdmin = user?.role === 'admin';

    if (!isAdmin) {
      // 1. Kiểm tra xem người dùng đã mua sản phẩm này và đơn hàng đã hoàn thành chưa
      const hasPurchased = await Order.findOne({
        user_id: userId,
        status: 'delivered', 
        'items.product_id': new mongoose.Types.ObjectId(productId),
      });

      if (!hasPurchased) {
        const error = new Error('You can only review products you have purchased and received.');
        error.status = 403;
        throw error;
      }
    }

    // 2. Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({ 
      user_id: userId, 
      product_id: new mongoose.Types.ObjectId(productId) 
    });
    
    if (existingReview) {
      const error = new Error('You have already reviewed this product.');
      error.status = 400;
      throw error;
    }

    // 3. Tạo đánh giá mới (Tự động duyệt - Approved mặc định trong trường hợp này, hoặc giữ Pending nếu muốn admin duyệt)
    const review = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      comment,
      status: 'approved', // Cho phép hiển thị ngay
    });

    // 4. Cập nhật rating và review_count trong Product model
    const product = await Product.findById(productId);
    if (product) {
      const currentCount = product.review_count || 0;
      const currentRating = product.rating || 0;
      
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + rating) / newCount;

      product.review_count = newCount;
      product.rating = Math.round(newRating * 10) / 10; // Làm tròn 1 chữ số thập phân
      await product.save();
    }

    return review;
  },

  /**
   * Lấy danh sách đánh giá của một sản phẩm
   */
  getByProduct: async (productId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product_id: productId, status: 'approved' })
      .populate('user_id', 'full_name') // Chỉ lấy tên người dùng
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({ product_id: productId, status: 'approved' });

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Kiểm tra quyền đánh giá (dành cho frontend)
   */
  canReview: async (userId, productId) => {
    try {
      // 0. Bypass cho Admin
      const user = await User.findById(userId);
      if (user?.role === 'admin') return true;

      // 1. Kiểm tra xem đã đánh giá chưa
      const existingReview = await Review.findOne({ 
        user_id: userId, 
        product_id: new mongoose.Types.ObjectId(productId) 
      });
      if (existingReview) return false;

      // 2. Kiểm tra mua hàng
      const hasPurchased = await Order.findOne({
        user_id: userId,
        status: 'delivered',
        'items.product_id': new mongoose.Types.ObjectId(productId),
      });

      return !!hasPurchased;
    } catch (error) {
      console.error('Error in canReview:', error);
      return false;
    }
  }
};

export default reviewService;
