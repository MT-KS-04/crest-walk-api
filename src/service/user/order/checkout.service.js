/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';
import Cart from '../../../model/cart.model.js';

const checkoutService = async (userId, payload) => {
  const { address, phone, payment_method } = payload;

  if (!address || !phone || !payment_method) {
    const error = new Error('address, phone, and payment_method are required');
    error.status = 400;
    throw error;
  }

  // 1. Fetch user cart with populated product data
  const cart = await Cart.findOne({ user_id: userId }).populate({
    path: 'items.product_id',
    select: 'name price sizes',
  });

  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty');
    error.status = 400;
    throw error;
  }

  let totalPrice = 0;
  const orderItems = [];

  // 2. Validate items against current product stock and prepare order schema
  for (const item of cart.items) {
    const product = item.product_id;

    if (!product) {
      const error = new Error('A product in your cart is no longer available');
      error.status = 400;
      throw error;
    }

    const stock = product.sizes.find((s) => s.size === item.size);
    if (!stock || stock.quantity < item.quantity) {
      const error = new Error(
        `Item ${product.name} (Size ${item.size}) is out of stock or insufficient quantity`,
      );
      error.status = 400;
      throw error;
    }

    const priceAtPurchase = product.price;
    totalPrice += priceAtPurchase * item.quantity;

    orderItems.push({
      product_id: product._id,
      product_name: product.name,
      size: item.size,
      quantity: item.quantity,
      price: priceAtPurchase,
    });
  }

  // 3. Create the Order
  const newOrder = new Order({
    user_id: userId,
    items: orderItems,
    total_price: totalPrice,
    status: 'pending', // Do not deduct stock yet, wait for admin confirmation
    payment_method: payment_method,
    payment_status: payment_method === 'Online' ? 'paid' : 'unpaid', // Naive mock for Gateway
    address: address,
    phone: phone,
  });

  await newOrder.save();

  // 4. Clear the shopping cart
  cart.items = [];
  await cart.save();

  return newOrder;
};

export default checkoutService;
