/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import filterService from '../../../service/user/product/filter.service.js';

const filter = async (req, res) => {
  try {
    const data = await filterService(req.query);

    res.status(200).json({
      success: true,
      ...data,
    });

    logger.info('Products filtered successfully', { query: req.query });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error filtering products', error);
  }
};

export default filter;
