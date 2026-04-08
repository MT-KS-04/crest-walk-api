/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Voucher from '../../../model/voucher.model.js';

const getVouchersService = async (query = {}) => {
  const filter = {};

  if (query.is_active !== undefined) {
    filter.is_active = query.is_active === 'true';
  }

  if (query.search) {
    filter.code = { $regex: query.search, $options: 'i' };
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const vouchers = await Voucher.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Voucher.countDocuments(filter);

  return {
    vouchers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export default getVouchersService;
