/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateVoucherService from '../../../service/admin/voucher/updateVoucher.service.js';

const updateVoucher = async (req, res) => {
  try {
    const updatedVoucher = await updateVoucherService(req.params.id, req.body);

    res.status(200).json({
      message: 'Voucher updated successfully',
      data: updatedVoucher,
    });

    logger.info('Voucher updated', { voucherId: updatedVoucher._id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'Conflict',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error updating voucher', error);
  }
};

export default updateVoucher;
