/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { v2 as cloudinary } from 'cloudinary';

/**
 * Custom Modules
 */
import config from '../config/env.config.js';
import logger from './winston.js';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string|undefined} publicId - Existing public_id to overwrite (optional)
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, publicId, folder = 'crest-walk') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['png', 'jpg', 'webp'],
          resource_type: 'image',
          folder,
          ...(publicId && { public_id: publicId }),
          transformation: { quality: 'auto' },
        },
        (err, result) => {
          if (err) {
            logger.error('Error uploading image to Cloudinary', err);
            return reject(err);
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export default uploadToCloudinary;
