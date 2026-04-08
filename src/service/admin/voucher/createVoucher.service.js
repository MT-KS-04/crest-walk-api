/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Voucher from '../../../model/voucher.model.js';

const createVoucherService = async (data) => {
  // Check for uniqueness
  const existingVoucher = await Voucher.findOne({
    code: data.code.toUpperCase(),
  });

  if (existingVoucher) {
    const error = new Error('Voucher code already exists');
    error.statusCode = 409;
    throw error;
  }

  const newVoucher = await Voucher.create({
    code: data.code,
    description: data.description,
    discount_type: data.discount_type,
    discount_amount: data.discount_amount,
    min_order: data.min_order,
    max_uses: data.max_uses,
    start_date: data.start_date,
    end_date: data.end_date,
    is_active: data.is_active,
  });

  return newVoucher;
};

export default createVoucherService;
