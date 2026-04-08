/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Banner from '../../../model/banner.model.js';

const deleteBannerService = async (id) => {
  const banner = await Banner.findById(id);

  if (!banner) {
    const error = new Error('Banner not found');
    error.statusCode = 404;
    throw error;
  }

  await Banner.findByIdAndDelete(id);

  return { message: 'Banner deleted successfully' };
};

export default deleteBannerService;
