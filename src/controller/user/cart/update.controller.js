/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import updateService from '../../../service/user/cart/update.service.js';

const update = async (req, res) => {
  try {
    const data = await updateService(req.userId, req.body);
    res.status(200).json({ success: true, message: 'Cart updated', data });
    
    logger.info('Cart updated successfully', { userId: req.userId, payload: req.body });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ code: status === 400 ? 'BadRequest' : 'ServerError', message: error.message });
    logger.error('Error updating cart', error);
  }
};

export default update;
