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

const isDataUrl = (value) =>
  typeof value === 'string' && /^data:.*;base64,/.test(value);

const getBase64Payload = (dataUrl) => {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : '';
};

const base64ByteLength = (base64) => {
  if (!base64) return 0;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const normalizeStringArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [value];
      }
    }
    return [value];
  }
  return [];
};

// ─────────────────────────────────────────────
// Middleware: Upload Banner Image
// Dùng multer.single('image') ở route
// Field được set vào req.body: image_url, publicId
// ─────────────────────────────────────────────
const uploadBannerImage = (method) => {
  return async (req, res, next) => {
    // PUT không bắt buộc phải có file
    if (method === 'put' && !req.file) {
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
      const { bannerId } = req.params;

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
    const files = Array.isArray(req.files) ? req.files : [];
    const bodyImages = normalizeStringArray(req.body?.images);
    const hasFiles = files.length > 0;
    const hasBodyImages = bodyImages.length > 0;

    if (method === 'put' && !hasFiles && !hasBodyImages) {
      return next();
    }

    if (!hasFiles && !hasBodyImages) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'At least one product image is required',
      });
    }

    if (hasFiles) {
      const oversizedFile = files.find(isOversized);
      if (oversizedFile) {
        return res.status(413).json({
          code: 'ValidationError',
          message: 'Each image must be less than 2MB',
        });
      }
    }

    if (hasBodyImages && bodyImages.length > 10) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Maximum 10 images are allowed',
      });
    }

    try {
      const productId = req.params.productId || req.params.id;

      // Với PUT: lấy publicIds cũ (nếu muốn overwrite từng ảnh theo thứ tự)
      // Nếu số ảnh mới khác số cũ thì truyền undefined để Cloudinary tự sinh id mới
      let existingPublicIds = [];
      if (productId && method === 'put') {
        const product = await Product.findById(productId)
          .select('publicIds')
          .exec();
        existingPublicIds = product?.publicIds || [];
      }

      if (hasFiles) {
        const uploads = await Promise.all(
          files.map((file, index) =>
            uploadToCloudinary(
              file.buffer,
              existingPublicIds[index] || undefined,
              FOLDER_PRODUCT,
            ),
          ),
        );

        req.body.images = uploads.map((data) => data.secure_url);
        req.body.publicIds = uploads.map((data) => data.public_id);
      } else {
        const uploads = await Promise.all(
          bodyImages.map((img, index) => {
            if (!isDataUrl(img)) return null;
            const base64 = getBase64Payload(img);
            const bytes = base64ByteLength(base64);
            if (bytes > MAX_FILE_SIZE) {
              const err = new Error('Each image must be less than 2MB');
              err.http_code = 413;
              throw err;
            }
            const buffer = Buffer.from(base64, 'base64');
            return uploadToCloudinary(
              buffer,
              existingPublicIds[index] || undefined,
              FOLDER_PRODUCT,
            );
          }),
        );

        req.body.images = bodyImages.map((img, index) => {
          const uploaded = uploads[index];
          return uploaded ? uploaded.secure_url : img;
        });

        const publicIds = uploads.filter(Boolean).map((data) => data.public_id);
        if (publicIds.length > 0) {
          req.body.publicIds = publicIds;
        }
      }

      logger.info('Product images uploaded to Cloudinary', {
        productId,
        count: Array.isArray(req.body.images) ? req.body.images.length : 0,
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
