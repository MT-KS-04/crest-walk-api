/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

const wishlistSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
  },
  {
    timestamps: true,
  },
);

// Đảm bảo mỗi user chỉ có thể thêm 1 sản phẩm vào wishlist một lần
wishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const Wishlist = model('Wishlist', wishlistSchema);

export default Wishlist;
