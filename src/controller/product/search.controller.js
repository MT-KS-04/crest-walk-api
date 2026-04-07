/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../lib/winston.js';
import searchService from '../../service/product/search.service.js';

const search = async (req, res) => {
  try {
    const data = await searchService(req.query);

    res.status(200).json({
      success: true,
      ...data,
    });

    logger.info('Products searched successfully', {
      keyword: req.query.keyword,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error searching products', error);
  }
};

export default search;
