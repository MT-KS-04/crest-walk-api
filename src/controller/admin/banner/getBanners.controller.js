/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getBannersService from '../../../service/admin/banner/getBanners.service.js';

const getBanners = async (req, res) => {
  try {
    const data = await getBannersService(req.query);

    res.status(200).json({
      message: 'Banners fetched successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error fetching banners', error);
  }
};

export default getBanners;
