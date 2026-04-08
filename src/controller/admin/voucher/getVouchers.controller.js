/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getVouchersService from '../../../service/admin/voucher/getVouchers.service.js';

const getVouchers = async (req, res) => {
  try {
    const data = await getVouchersService(req.query);

    res.status(200).json({
      message: 'Vouchers fetched successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error fetching vouchers', error);
  }
};

export default getVouchers;
