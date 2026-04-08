/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Banner from '../../../model/banner.model.js';

const createBannerService = async (data) => {
  const newBanner = await Banner.create({
    title: data.title,
    image_url: data.image_url,
    link_url: data.link_url || '',
    position: data.position || 'hero',
    order_index: data.order_index || 0,
    is_active: data.is_active !== undefined ? data.is_active : true,
  });

  return newBanner;
};

export default createBannerService;
