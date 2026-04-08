/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import User from '../../../model/user.model.js';
import Order from '../../../model/order.model.js';

const getUserByIdService = async (id) => {
  const user = await User.findById(id).select('-password').lean().exec();

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Optional: Add summary of order history
  const orderCount = await Order.countDocuments({ user_id: id });

  return {
    ...user,
    stats: {
      total_orders: orderCount,
    },
  };
};

export default getUserByIdService;
