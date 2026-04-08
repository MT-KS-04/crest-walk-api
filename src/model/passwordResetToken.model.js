/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Schema, model } from 'mongoose';

const passwordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

export default model('PasswordResetToken', passwordResetTokenSchema);
