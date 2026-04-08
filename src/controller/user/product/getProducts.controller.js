import logger from '../../../lib/winston.js';
import getProductsService from '../../../service/user/product/getProducts.service.js';

const getProducts = async (req, res) => {
  try {
    const data = await getProductsService(req.query);

    res.status(200).json({
      success: true,
      ...data,
    });

    logger.info('Products retrieved successfully', { query: req.query });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      code: status === 400 ? 'BadRequest' : 'ServerError',
      message: error.message || 'Internal Server Error',
    });

    logger.error('Error getting products', error);
  }
};

export default getProducts;

