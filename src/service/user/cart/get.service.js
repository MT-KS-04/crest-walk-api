/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Cart from '../../../model/cart.model.js';

const getService = async (userId) => {
  const cart = await Cart.findOne({ user_id: userId })
    .populate({
      path: 'items.product_id',
      select: 'name price original_price images is_sale is_new sizes',
      populate: { path: 'brand_id category_id', select: 'name' }
    });

  if (!cart) {
    return {
      items: [],
      total_price: 0,
      total_items: 0
    };
  }

  let totalPrice = 0;
  let totalItems = 0;

  const refinedItems = cart.items.map(item => {
    // Check if the product still exists in Database
    if (item.product_id) {
       totalPrice += (item.product_id.price * item.quantity);
       totalItems += item.quantity;
    }
    return item;
  });

  return {
    items: refinedItems,
    total_price: totalPrice,
    total_items: totalItems
  };
};

export default getService;
