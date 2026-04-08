/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import reviewController from '../../controller/user/review/review.controller.js';
import authenticate from '../../middleware/authenticate.js';

const router = Router();

// Lấy danh sách đánh giá của sản phẩm (Public)
router.get('/product/:productId', reviewController.getProductReviews);

// Kiểm tra quyền đánh giá (Private)
router.get('/can-review/:productId', authenticate, reviewController.checkCanReview);

// Gửi đánh giá (Private)
router.post('/', authenticate, reviewController.createReview);

export default router;
