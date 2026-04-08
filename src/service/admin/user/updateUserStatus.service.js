/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import User from '../../../model/user.model.js';

const updateUserStatusService = async (adminId, targetUserId, data) => {
  const { status, role } = data;

  // Check if target user exists
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // PROTECTION: Prevent admin from blocking themselves
  if (adminId.toString() === targetUserId.toString() && status === 'blocked') {
    const error = new Error('You cannot block your own admin account.');
    error.statusCode = 400;
    throw error;
  }

  // PROTECTION: Prevent admin from demoting themselves from admin role
  if (adminId.toString() === targetUserId.toString() && role === 'user') {
    const error = new Error('You cannot demote yourself from Admin role.');
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (role) updateData.role = role;

  const updatedUser = await User.findByIdAndUpdate(
    targetUserId,
    { $set: updateData },
    { new: true, runValidators: true },
  )
    .select('-password')
    .exec();

  return updatedUser;
};

export default updateUserStatusService;
