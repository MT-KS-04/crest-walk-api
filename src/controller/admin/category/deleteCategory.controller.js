/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import deleteCategoryService from '../../../service/admin/category/deleteCategory.service.js';

const deleteCategory = async (req, res) => {
  try {
    await deleteCategoryService(req.params.id);

    res.status(200).json({
      message: 'Category deleted successfully',
      data: null,
    });

    logger.info(`Category deleted: ${req.params.id}`);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code: error.statusCode === 404 ? 'NotFound' : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error deleting category: ${req.params.id}`, error);
  }
};

export default deleteCategory;
