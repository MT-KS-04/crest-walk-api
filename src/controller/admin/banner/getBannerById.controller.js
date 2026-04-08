/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getBannerByIdService from '../../../service/admin/banner/getBannerById.service.js';

const getBannerById = async (req, res) => {
  try {
    const banner = await getBannerByIdService(req.params.id);

    res.status(200).json({
      message: 'Banner fetched successfully',
      data: banner,
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

    logger.error('Error fetching banner', error);
  }
};

export default getBannerById;
