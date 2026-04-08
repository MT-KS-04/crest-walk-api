/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteVoucherService from '../../../service/admin/voucher/deleteVoucher.service.js';

const deleteVoucher = async (req, res) => {
  try {
    const response = await deleteVoucherService(req.params.id);

    res.status(200).json({
      message: response.message,
    });

    logger.info('Voucher deleted', { voucherId: req.params.id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: 'NotFound',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error deleting voucher', error);
  }
};

export default deleteVoucher;
