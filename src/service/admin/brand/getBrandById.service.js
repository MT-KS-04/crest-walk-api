/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Brand from '../../../model/brand.model.js';

const getBrandByIdService = async (id) => {
  const brand = await Brand.findById(id).lean().exec();

  if (!brand) {
    const error = new Error('Brand not found');
    error.statusCode = 404;
    throw error;
  }

  return brand;
};

export default getBrandByIdService;
