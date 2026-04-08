/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const getBestsellersService = async (query = {}) => {
  const { limit, startDate, endDate } = query;
  const topLimit = Math.max(1, parseInt(limit, 10) || 10); // Fix: chặn limit âm

  // 1. Lọc điều kiện:
  // - đơn đã thanh toán thành công
  // - hoặc đơn COD đã giao thành công (tránh miss dữ liệu COD)
  // - loại trừ đơn đã hủy
  const matchStage = {
    status: { $ne: 'cancelled' },
    $or: [
      { payment_status: 'paid' },
      { payment_method: 'COD', status: 'delivered' },
    ],
  };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) {
      matchStage.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      // Fix: đẩy về cuối ngày để bao gồm toàn bộ ngày endDate
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchStage.createdAt.$lte = end;
    }
  }

  // 2. Aggregate pipeline
  const pipeline = [
    { $match: matchStage },
    { $unwind: '$items' }, // Tách mảng items của từng đơn hàng ra thành các doc riêng lẻ
    {
      $group: {
        _id: '$items.product_id',
        product_name: { $first: '$items.product_name' }, // Lấy tên đã lưu trong order (nếu có)
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: topLimit },

    // Fix: $lookup để lấy tên sản phẩm mới nhất từ Product collection
    // (fallback về tên đã lưu trong order nếu product bị xóa)
    {
      $lookup: {
        from: 'products', // tên collection trong MongoDB (thường là số nhiều, lowercase)
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    {
      $addFields: {
        product_name: {
          $ifNull: [
            { $arrayElemAt: ['$productInfo.name', 0] },
            '$product_name', // fallback nếu product đã bị xóa
          ],
        },
      },
    },
    {
      $project: {
        productInfo: 0, // loại bỏ field thừa sau lookup
      },
    },
  ];

  const results = await Order.aggregate(pipeline);

  const formattedResults = results.map((item) => ({
    product_id: item._id,
    product_name: item.product_name,
    totalSold: item.totalSold,
    totalRevenue: item.totalRevenue,
  }));

  return formattedResults;
};

export default getBestsellersService;
