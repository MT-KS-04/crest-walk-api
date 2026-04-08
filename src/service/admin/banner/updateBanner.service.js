/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Banner from '../../../model/banner.model.js';

const updateBannerService = async (id, data) => {
  const banner = await Banner.findById(id);

  if (!banner) {
    const error = new Error('Banner not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedBanner = await Banner.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedBanner;
};

export default updateBannerService;
