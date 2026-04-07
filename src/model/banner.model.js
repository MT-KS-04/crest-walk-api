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
    title: {
      type: String,
      required: [true, 'Banner title is required'],
    },
    image_url: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    link_url: {
      type: String,
      default: '',
    },
    position: {
      type: String,
      enum: {
        values: ['hero', 'sidebar', 'popup'],
        message: 'Position must be hero, sidebar or popup',
      },
      default: 'hero',
    },
    order_index: {
      type: Number,
      default: 0,
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
