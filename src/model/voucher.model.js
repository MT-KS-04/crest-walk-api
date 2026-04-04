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
    discount_amount: {
      type: Number,
      required: [true, 'Discount amount is required'],
      min: [0, 'Discount amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  },
);

const Voucher = model('Voucher', voucherSchema);

export default Voucher;
