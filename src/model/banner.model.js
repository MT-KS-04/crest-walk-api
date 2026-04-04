/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

const bannerSchema = new Schema(
  {
    image_url: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    link_url: {
      type: String,
      default: '',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Banner = model('Banner', bannerSchema);

export default Banner;
