/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getVoucherByIdService from '../../../service/admin/voucher/getVoucherById.service.js';

const getVoucherById = async (req, res) => {
  try {
    const voucher = await getVoucherByIdService(req.params.id);

    res.status(200).json({
      message: 'Voucher fetched successfully',
      data: voucher,
    });
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

    logger.error('Error fetching voucher', error);
  }
};

export default getVoucherById;
