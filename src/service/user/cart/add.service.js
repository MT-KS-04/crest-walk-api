/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Cart from '../../../model/cart.model.js';
import Product from '../../../model/product.model.js';

const addService = async (userId, payload) => {
  const { product_id, size, quantity } = payload;

  if (!product_id || size === undefined || !quantity || quantity <= 0) {
    const error = new Error('Product ID, size, and a valid quantity are required');
    error.status = 400;
    throw error;
  }

  const product = await Product.findById(product_id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  const productSize = product.sizes.find(s => s.size === Number(size));
  if (!productSize) {
    const error = new Error(`Size ${size} is not available for this product`);
    error.status = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user_id: userId });

  if (!cart) {
    if (quantity > productSize.quantity) {
      const error = new Error(`Only ${productSize.quantity} items left in stock for size ${size}`);
      error.status = 400;
      throw error;
    }

    cart = new Cart({
      user_id: userId,
      items: [{ product_id, size: Number(size), quantity: Number(quantity) }]
    });
  } else {
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id && item.size === Number(size)
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + Number(quantity);
      
      if (newQuantity > productSize.quantity) {
        const error = new Error(`Cannot add more. Only ${productSize.quantity} items left in stock for size ${size}`);
        error.status = 400;
        throw error;
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      if (quantity > productSize.quantity) {
        const error = new Error(`Only ${productSize.quantity} items left in stock for size ${size}`);
        error.status = 400;
        throw error;
      }
      
      cart.items.push({ product_id, size: Number(size), quantity: Number(quantity) });
    }
  }

  await cart.save();
  return cart;
};

export default addService;
