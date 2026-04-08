import Product from '../../../model/product.model.js';

const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value));

const parsePositiveInt = (value, defaultValue) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return defaultValue;
  return n;
};

const getSortSpec = (sortBy) => {
  switch (sortBy) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'rating':
      return { rating: -1, review_count: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};

const getProductsService = async (query) => {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(parsePositiveInt(query.limit, 10), 50);
  const skip = (page - 1) * limit;

  const keyword = (query.search || query.q || '').trim();
  const category = query.category || query.category_id;
  const brand = query.brand || query.brand_id;
  const sortBy = query.sortBy || query.sort || 'newest';
  const minPrice = query.minPrice || query.min_price;
  const maxPrice = query.maxPrice || query.max_price;
  const size = query.size;

  const filter = {};

  // Tìm kiếm theo từ khóa (Chức năng 6)
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Lọc theo danh mục
  if (category) {
    if (!isMongoId(category)) {
      const error = new Error('Invalid category id');
      error.status = 400;
      throw error;
    }
    filter.category_id = category;
  }

  // Lọc theo thương hiệu
  if (brand) {
    if (!isMongoId(brand)) {
      const error = new Error('Invalid brand id');
      error.status = 400;
      throw error;
    }
    filter.brand_id = brand;
  }

  // Lọc theo giá (Chức năng 7)
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice && !isNaN(Number(minPrice)))
      filter.price.$gte = Number(minPrice);
    if (maxPrice && !isNaN(Number(maxPrice)))
      filter.price.$lte = Number(maxPrice);
    if (Object.keys(filter.price).length === 0) delete filter.price;
  }

  // Lọc theo kích thước (Chức năng 7)
  if (size && !isNaN(Number(size))) {
    filter['sizes.size'] = Number(size);
    filter['sizes.quantity'] = { $gt: 0 }; // Chỉ hiện sản phẩm còn hàng ở size đó
  }

  const products = await Product.find(filter)
    .select(
      'name price original_price images is_sale is_new rating review_count brand_id category_id createdAt',
    )
    .populate('category_id', 'name slug')
    .populate('brand_id', 'name slug')
    .sort(getSortSpec(sortBy))
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  const total = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export default getProductsService;
