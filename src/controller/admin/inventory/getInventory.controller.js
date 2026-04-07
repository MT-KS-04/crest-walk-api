/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../../lib/winston.js';
import getInventoryService from '../../../service/admin/inventory/getInventory.service.js';

const getInventory = async (req, res) => {
  try {
    const data = await getInventoryService(req.query);

    res.status(200).json({
      message: 'Inventory retrieved successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error('Error getting inventory', error);
  }
};

export default getInventory;
