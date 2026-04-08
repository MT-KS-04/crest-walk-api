/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';

const getRevenueService = async (query = {}) => {
  const { interval = 'day', startDate, endDate } = query;

  // 1. Build Match pipeline (Only paid orders)
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
