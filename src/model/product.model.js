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
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    description: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: '',
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
