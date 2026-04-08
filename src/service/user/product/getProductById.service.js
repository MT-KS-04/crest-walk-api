import Product from '../../../model/product.model.js';

const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value));

const getProductByIdService = async (id) => {
  if (!isMongoId(id)) {
    const error = new Error('Invalid product id');
    error.status = 400;
    throw error;
  }

  const product = await Product.findById(id)
    .select(
      'name price original_price images description is_new is_sale rating review_count brand_id category_id sizes createdAt',
    )
    .populate('category_id', 'name slug')
    .populate('brand_id', 'name slug')
    .lean()
    .exec();

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  return { product };
};

export default getProductByIdService;
