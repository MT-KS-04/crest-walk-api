/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import User from '../../../model/user.model.js';

const resetUserPasswordService = async (id, newPassword) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Update password field. The pre-save hook in user.model.js will handle the hashing.
  user.password = newPassword;
  await user.save();

  return true;
};

export default resetUserPasswordService;
