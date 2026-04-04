/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      maxLength: [50, 'Category name must be less than 50 characters'],
      unique: [true, 'Category name must be unique'],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category = model('Category', categorySchema);

export default Category;
