/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import createBannerService from '../../../service/admin/banner/createBanner.service.js';

const createBanner = async (req, res) => {
  try {
    const newBanner = await createBannerService(req.body);

    res.status(201).json({
      message: 'Banner created successfully',
      data: newBanner,
    });

    logger.info('Banner created', { bannerId: newBanner._id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error creating banner', error);
  }
};

export default createBanner;
