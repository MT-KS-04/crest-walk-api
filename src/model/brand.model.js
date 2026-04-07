/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: [true, 'Brand name must be unique'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: [true, 'Slug must be unique'],
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = model('Brand', brandSchema);

export default Brand;
