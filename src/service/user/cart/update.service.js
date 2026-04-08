/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Cart from '../../../model/cart.model.js';
import Product from '../../../model/product.model.js';

const updateService = async (userId, payload) => {
  const { product_id, size, quantity } = payload;
  
  if (!product_id || size === undefined || quantity === undefined) {
     const error = new Error('product_id, size, and quantity are required'); 
     error.status = 400; 
     throw error;
  }

  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
     const error = new Error('Cart not found'); 
     error.status = 404; 
     throw error;
  }

  const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id && item.size === Number(size));
  if (itemIndex === -1) {
     const error = new Error('Item not found in cart'); 
     error.status = 404; 
     throw error;
  }

  if (Number(quantity) === 0) {
      cart.items.splice(itemIndex, 1);
  } else {
      const product = await Product.findById(product_id);
      if (!product) { 
        const error = new Error('Product no longer exists'); 
        error.status = 404; 
        throw error; 
      }
      
      const stock = product.sizes.find(s => s.size === Number(size));
      if (!stock || Number(quantity) > stock.quantity) {
          const error = new Error(`Cannot update quantity. Only ${stock ? stock.quantity : 0} items in stock`);
          error.status = 400;
          throw error;
      }
      cart.items[itemIndex].quantity = Number(quantity);
  }

  await cart.save();
  return cart;
};

export default updateService;
