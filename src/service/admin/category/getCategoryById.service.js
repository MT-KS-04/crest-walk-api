/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Category from '../../../model/category.model.js';

const getCategoryByIdService = async (id) => {
  const category = await Category.findById(id).lean().exec();

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export default getCategoryByIdService;
