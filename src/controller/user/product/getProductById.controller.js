import logger from '../../../lib/winston.js';
import getProductByIdService from '../../../service/user/product/getProductById.service.js';

const getProductById = async (req, res) => {
  try {
    const data = await getProductByIdService(req.params.id);
    res.status(200).json({
      success: true,
      ...data,
    });
    logger.info('Product detail retrieved successfully', { id: req.params.id });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    res.status(status).json({
      code:
        status === 400
          ? 'BadRequest'
          : status === 404
            ? 'NotFound'
            : 'ServerError',
      message: error.message || 'Internal Server Error',
    });
    logger.error('Error getting product detail', error);
  }
};

export default getProductById;
