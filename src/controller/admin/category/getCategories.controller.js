/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getCategoriesService from '../../../service/admin/category/getCategories.service.js';

const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();

    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting categories', error);
  }
};

export default getCategories;
