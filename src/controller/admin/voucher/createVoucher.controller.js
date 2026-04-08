/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import createVoucherService from '../../../service/admin/voucher/createVoucher.service.js';

const createVoucher = async (req, res) => {
  try {
    const newVoucher = await createVoucherService(req.body);

    res.status(201).json({
      message: 'Voucher created successfully',
      data: newVoucher,
    });

    logger.info('Voucher created', { voucherId: newVoucher._id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 409 ? 'Conflict' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error creating voucher', error);
  }
};

export default createVoucher;
