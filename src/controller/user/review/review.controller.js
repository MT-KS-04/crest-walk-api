/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import reviewService from '../../../service/user/review/review.service.js';

const reviewController = {
  /**
   * Tạo đánh giá
   */
  createReview: async (req, res) => {
    try {
      const { product_id, rating, comment } = req.body;
      const userId = req.userId;

      if (!product_id || !rating) {
        return res.status(400).json({
          code: 'BadRequest',
          message: 'Product ID and Rating are required',
        });
      }

      const review = await reviewService.create(userId, product_id, rating, comment);

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review submitted successfully',
      });

      logger.info('Review created', { userId, productId: product_id });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        code: status === 400 ? 'BadRequest' : (status === 403 ? 'Forbidden' : 'ServerError'),
        message: error.message || 'Internal Server Error',
      });

      logger.error('Error creating review', error);
    }
  },

  /**
   * Lấy danh sách đánh giá của sản phẩm
   */
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const { page, limit } = req.query;

      const result = await reviewService.getByProduct(productId, parseInt(page) || 1, parseInt(limit) || 10);

      res.status(200).json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal Server Error',
      });

      logger.error('Error fetching reviews', error);
    }
  },

  /**
   * Kiểm tra xem user có quyền đánh giá không
   */
  checkCanReview: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.userId;

      const canReview = await reviewService.canReview(userId, productId);

      res.status(200).json({
        success: true,
        data: { canReview },
      });
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal Server Error',
      });
    }
  }
};

export default reviewController;
