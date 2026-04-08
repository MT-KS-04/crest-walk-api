/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const getRevenueService = async (query = {}) => {
  const { interval = 'day', startDate, endDate } = query;

  // 1. Build Match pipeline
  // Include:
  // - all successfully paid orders
  // - COD orders that were delivered (often still marked unpaid in current flow)
  // Exclude cancelled orders from revenue.
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

  // 2. Build Date Format for Grouping based on interval
  let formatString = '%Y-%m-%d'; // Default: day
  if (interval === 'month') {
    formatString = '%Y-%m';
  } else if (interval === 'year') {
    formatString = '%Y';
  }

  const groupStage = {
    _id: {
      $dateToString: { format: formatString, date: '$createdAt' },
    },
    totalRevenue: { $sum: '$total_price' },
    orderCount: { $sum: 1 },
  };

  const sortStage = { _id: 1 }; // Sort chronologically

  // 3. Execute Aggregation Pipeline
  const pipeline = [
    { $match: matchStage },
    { $group: groupStage },
    { $sort: sortStage },
  ];

  const results = await Order.aggregate(pipeline);

  // Format array to a cleaner structure
  const formattedResults = results.map((item) => ({
    date: item._id,
    revenue: item.totalRevenue,
    orders: item.orderCount,
  }));

  // Calculate total across timeline
  const overallRevenue = formattedResults.reduce(
    (acc, curr) => acc + curr.revenue,
    0,
  );
  const overallOrders = formattedResults.reduce(
    (acc, curr) => acc + curr.orders,
    0,
  );

  return {
    interval,
    timeline: formattedResults,
    summary: {
      totalRevenue: overallRevenue,
      totalOrders: overallOrders,
    },
  };
};

export default getRevenueService;
