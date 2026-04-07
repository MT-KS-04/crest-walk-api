/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Brand from '../../../model/brand.model.js';

const getBrandsService = async () => {
  // Similar to Category, usually a small fixed list. No pagination needed initially.
  const brands = await Brand.find({}).sort({ createdAt: -1 }).lean().exec();

  return brands;
};

export default getBrandsService;
