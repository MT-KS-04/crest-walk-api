/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const getBestsellersService = async (query = {}) => {
  const { limit, startDate, endDate } = query;
  const topLimit = parseInt(limit, 10) || 10;

  // 1. Lọc điều kiện: Đơn hàng đã thanh toán thành công
  const matchStage = {
    payment_status: 'paid',
  };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) {
      matchStage.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      matchStage.createdAt.$lte = new Date(endDate);
    }
  }

  // 2. Aggregate pipeline
  const pipeline = [
    { $match: matchStage },
    { $unwind: '$items' }, // Tách mảng items của từng đơn hàng ra thành các doc riêng lẻ
    {
      $group: {
        _id: '$items.product_id', // Nhóm theo id sản phẩm
        product_name: { $first: '$items.product_name' }, // Lấy tên sản phẩm
        totalSold: { $sum: '$items.quantity' }, // Cộng dồn số lượng
        totalRevenue: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] }, // Tính tổng doanh thu từ sản phẩm
        },
      },
    },
    { $sort: { totalSold: -1 } }, // Sắp xếp theo số lượng bán nhiều nhất
    { $limit: topLimit }, // Giới hạn top N
  ];

  const results = await Order.aggregate(pipeline);

  // Format lại array cho đẹp
  const formattedResults = results.map((item) => ({
    product_id: item._id,
    product_name: item.product_name,
    totalSold: item.totalSold,
    totalRevenue: item.totalRevenue,
  }));

  return formattedResults;
};

export default getBestsellersService;
