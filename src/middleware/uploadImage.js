/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import logger from '../lib/winston.js';
import uploadToCloudinary from '../lib/cloudinary.js';

/**
 * Models
 */
import Banner from '../model/banner.model.js';
import Product from '../model/product.model.js';

/**
 * Constants
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const FOLDER_BANNER = 'crest-walk/banners';
const FOLDER_PRODUCT = 'crest-walk/products';

// ─────────────────────────────────────────────
// Helper: check file size
// ─────────────────────────────────────────────
const isOversized = (file) => file.size > MAX_FILE_SIZE;

// ─────────────────────────────────────────────
// Middleware: Upload Banner Image
// Dùng multer.single('image') ở route
// Field được set vào req.body: image_url, publicId
// ─────────────────────────────────────────────
const uploadBannerImage = (method) => {
  return async (req, res, next) => {
    const hasImageUrl =
      typeof req.body?.image_url === 'string' && req.body.image_url.trim() !== '';

    // PUT không bắt buộc phải có file
    if (method === 'put' && !req.file) {
      return next();
    }

    // POST: chấp nhận 1 trong 2 cách:
    // - upload file (req.file)
    // - gửi link/path qua body.image_url
    if (method === 'post' && !req.file && hasImageUrl) {
      return next();
    }

    if (!req.file) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Banner image is required',
      });
    }

    if (isOversized(req.file)) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
    }

    try {
      const bannerId = req.params.bannerId || req.params.id;

      // Lấy publicId cũ để overwrite trên Cloudinary (tránh tạo file thừa)
      let existingPublicId;
      if (bannerId) {
        const banner = await Banner.findById(bannerId)
          .select('publicId')
          .exec();
        existingPublicId = banner?.publicId;
      }

      const data = await uploadToCloudinary(
        req.file.buffer,
        existingPublicId,
        FOLDER_BANNER,
      );

      if (!data) {
        logger.error('Cloudinary returned empty result for banner upload', {
          bannerId,
        });
        return res.status(500).json({
          code: 'ServerError',
          message: 'Internal server error',
        });
      }

      // Map đúng field của banner_model
      req.body.image_url = data.secure_url;
      req.body.publicId = data.public_id;

      logger.info('Banner image uploaded to Cloudinary', {
        bannerId,
        publicId: data.public_id,
        url: data.secure_url,
      });

      next();
    } catch (err) {
      logger.error('Error uploading banner image to Cloudinary', err);
      res.status(err.http_code || 500).json({
        code: (err.http_code || 500) < 500 ? 'ValidationError' : 'ServerError',
        message: err.message,
      });
    }
  };
};

// ─────────────────────────────────────────────
// Middleware: Upload Product Images
// Dùng multer.array('images', 10) ở route
// Field được set vào req.body: images (array of URLs), publicIds (array)
// ─────────────────────────────────────────────
const uploadProductImages = (method) => {
  return async (req, res, next) => {
    // PUT không bắt buộc phải có file
    if (method === 'put' && (!req.files || req.files.length === 0)) {
      return next();
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'At least one product image is required',
      });
    }

    const oversizedFile = req.files.find(isOversized);
    if (oversizedFile) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'Each image must be less than 2MB',
      });
    }

    try {
      const { productId } = req.params;

      // Với PUT: lấy publicIds cũ (nếu muốn overwrite từng ảnh theo thứ tự)
      // Nếu số ảnh mới khác số cũ thì truyền undefined để Cloudinary tự sinh id mới
      let existingPublicIds = [];
      if (productId && method === 'put') {
        const product = await Product.findById(productId)
          .select('publicIds')
          .exec();
        existingPublicIds = product?.publicIds || [];
      }

      // Upload song song tất cả ảnh
      const uploads = await Promise.all(
        req.files.map((file, index) =>
          uploadToCloudinary(
            file.buffer,
            existingPublicIds[index] || undefined, // overwrite nếu có, không thì tạo mới
            FOLDER_PRODUCT,
          ),
        ),
      );

      // Map đúng field của product_model
      req.body.images = uploads.map((data) => data.secure_url);
      req.body.publicIds = uploads.map((data) => data.public_id);

      logger.info('Product images uploaded to Cloudinary', {
        productId,
        count: uploads.length,
        publicIds: req.body.publicIds,
      });

      next();
    } catch (err) {
      logger.error('Error uploading product images to Cloudinary', err);
      res.status(err.http_code || 500).json({
        code: (err.http_code || 500) < 500 ? 'ValidationError' : 'ServerError',
        message: err.message,
      });
    }
  };
};

export { uploadBannerImage, uploadProductImages };
