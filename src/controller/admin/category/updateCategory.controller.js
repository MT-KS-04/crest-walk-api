/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateCategoryService from '../../../service/admin/category/updateCategory.service.js';

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await updateCategoryService(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      message: 'Category updated successfully',
      data: updatedCategory,
    });

    logger.info(`Category updated: ${req.params.id}`);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        code:
          error.statusCode === 404
            ? 'NotFound'
            : error.statusCode === 409
              ? 'Conflict'
              : 'ValidationError',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error updating category: ${req.params.id}`, error);
  }
};

export default updateCategory;
