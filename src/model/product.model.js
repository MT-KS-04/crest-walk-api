/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

/**
 * Sub-schema: embedded product sizes
 * (Nhúng thay vì tách bảng riêng để tối ưu hiệu suất NoSQL)
 */
const productSizeSchema = new Schema(
  {
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand_id: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxLength: [150, 'Product name must be less than 150 characters'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    original_price: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: null,
    },
    images: {
      type: [String],
      required: [true, 'Product images are required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Product must have at least one image',
      },
    },
    description: {
      type: String,
      default: '',
    },
    is_new: {
      type: Boolean,
      default: false,
    },
    is_sale: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review_count: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    sizes: {
      type: [productSizeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Product = model('Product', productSchema);

export default Product;
