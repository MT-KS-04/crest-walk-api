/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import removeService from '../../../service/user/cart/remove.service.js';

const remove = async (req, res) => {
  try {
    const data = await removeService(req.userId, req.body);
    res
      .status(200)
      .json({ success: true, message: 'Item removed from cart', data });

    logger.info('Item removed from cart', {
      userId: req.userId,
      payload: req.body,
    });
  } catch (error) {
    const status = error.status || 500;
    res
      .status(status)
      .json({
        code: status === 400 ? 'BadRequest' : 'ServerError',
        message: error.message,
      });
    logger.error('Error removing item from cart', error);
  }
};

export default remove;
