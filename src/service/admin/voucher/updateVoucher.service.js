/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Voucher from '../../../model/voucher.model.js';

const updateVoucherService = async (id, data) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    const error = new Error('Voucher not found');
    error.statusCode = 404;
    throw error;
  }

  // If updating code, check for uniqueness
  if (data.code !== undefined && data.code.toUpperCase() !== voucher.code) {
    const existingVoucher = await Voucher.findOne({
      code: data.code.toUpperCase(),
    });
    if (existingVoucher) {
      const error = new Error('Voucher code already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  const updatedVoucher = await Voucher.findByIdAndUpdate(
    id,
    {
      ...data,
      code: data.code ? data.code.toUpperCase() : voucher.code,
    },
    { new: true, runValidators: true },
  );

  return updatedVoucher;
};

export default updateVoucherService;
