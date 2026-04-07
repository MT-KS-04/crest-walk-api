/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'Voucher code is required'],
      unique: [true, 'Voucher code must be unique'],
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discount_type: {
      type: String,
      enum: {
        values: ['percent', 'fixed'],
        message: 'Discount type must be percent or fixed',
      },
      required: [true, 'Discount type is required'],
      default: 'fixed',
    },
    discount_amount: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    min_order: {
      type: Number,
      default: 0,
    },
    max_uses: {
      type: Number,
      default: 0, // 0 = unlimited
    },
    used_count: {
      type: Number,
      default: 0,
    },
    start_date: {
      type: Date,
      default: null,
    },
    end_date: {
      type: Date,
      default: null,
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

const Voucher = model('Voucher', voucherSchema);

export default Voucher;
