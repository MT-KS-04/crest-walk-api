/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Banner from '../../../model/banner.model.js';

const getBannersService = async (query = {}) => {
  const filter = {};

  if (query.position) {
    filter.position = query.position;
  }

  if (query.is_active !== undefined) {
    filter.is_active = query.is_active === 'true';
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const banners = await Banner.find(filter)
    .sort({ order_index: 1, createdAt: -1 }) // Sort by order index ascending, then by creation
    .skip(skip)
    .limit(limit);

  const total = await Banner.countDocuments(filter);

  return {
    banners,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export default getBannersService;
