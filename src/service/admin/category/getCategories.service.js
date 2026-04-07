/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Category from '../../../model/category.model.js';

const getCategoriesService = async () => {
  // We can add pagination later if Category list gets too big,
  // but usually categories are a small fixed list.
  const categories = await Category.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return categories;
};

export default getCategoriesService;
