/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Voucher from '../../../model/voucher.model.js';

const getVoucherByIdService = async (id) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    const error = new Error('Voucher not found');
    error.statusCode = 404;
    throw error;
  }

  return voucher;
};

export default getVoucherByIdService;
