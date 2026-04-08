/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import { Router } from 'express';
import addReviewController from '../../controller/user/review/add.controller.js';
import getReviewController from '../../controller/user/review/get.controller.js';
import authenticate from '../../middleware/authenticate.js';

const router = Router();

// Thêm đánh giá/bình luận (Bắt buộc phải xì Token ra đăng nhập)
router.post('/add', authenticate, addReviewController);

// Chỗ này xem đánh giá của sản phẩm, khách thả rông không có tài khoản cũng được vào xem.
// Nên tôi KHÔNG kẹp hàm auth vào đây
router.get('/:productId', getReviewController);

export default router;
