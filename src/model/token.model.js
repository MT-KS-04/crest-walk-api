/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1w',
  },
});

export default model('Token', tokenSchema);
