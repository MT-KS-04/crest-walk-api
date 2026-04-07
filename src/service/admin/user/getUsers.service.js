/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import User from '../../../model/user.model.js';

const getUsersService = async (query) => {
  const { page = 1, limit = 10, search, role, status } = query;

  const filter = {};
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: 'i' } },
      { full_name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) {
    filter.role = role;
  }
  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitValue = parseInt(limit);

  const users = await User.find(filter)
    .select('-password') // Don't send passwords
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitValue)
    .lean()
    .exec();

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: limitValue,
      totalPages: Math.ceil(total / limitValue),
    },
  };
};

export default getUsersService;
