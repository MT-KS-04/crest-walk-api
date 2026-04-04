/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

/**
 * Sub-schema: embedded order items
 * (Nhúng thay vì tách bảng riêng để tối ưu hiệu suất NoSQL)
 */
const orderItemSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price at time of purchase is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    voucher_id: {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
      default: null,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    total_price: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'shipping', 'delivered', 'cancelled'],
        message: 'Status must be pending, shipping, delivered or cancelled',
      },
      default: 'pending',
    },
    payment_method: {
      type: String,
      enum: {
        values: ['COD', 'Online'],
        message: 'Payment method must be COD or Online',
      },
      required: [true, 'Payment method is required'],
    },
    address: {
      type: String,
      required: [true, 'Shipping address is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{9,11}$/, 'Please provide a valid phone number'],
    },
  },
  {
    timestamps: true,
  },
);

const Order = model('Order', orderSchema);

export default Order;
