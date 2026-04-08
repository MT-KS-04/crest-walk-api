/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateBannerService from '../../../service/admin/banner/updateBanner.service.js';

const updateBanner = async (req, res) => {
  try {
    const updatedBanner = await updateBannerService(req.params.id, req.body);

    res.status(200).json({
      message: 'Banner updated successfully',
      data: updatedBanner,
    });

    logger.info('Banner updated by admin', { bannerId: updatedBanner._id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error updating banner', error);
  }
};

export default updateBanner;
