/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteBannerService from '../../../service/admin/banner/deleteBanner.service.js';

const deleteBanner = async (req, res) => {
  try {
    const response = await deleteBannerService(req.params.id);

    res.status(200).json({
      message: response.message,
    });

    logger.info('Banner deleted by admin', { bannerId: req.params.id });
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

    logger.error('Error deleting banner', error);
  }
};

export default deleteBanner;
