/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import createCategoryService from '../../../service/admin/category/createCategory.service.js';

const createCategory = async (req, res) => {
  try {
    const newCategory = await createCategoryService(req.body);

    res.status(201).json({
      message: 'Category created successfully',
      data: newCategory,
    });

    logger.info('Category created', { categoryId: newCategory._id });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 409 ? 'Conflict' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error creating category', error);
  }
};

export default createCategory;
