/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Cart from '../../../model/cart.model.js';

const removeService = async (userId, payload) => {
   const { product_id, size } = payload;
   
   if (!product_id || size === undefined) { 
     const error = new Error('product_id and size are required'); 
     error.status = 400; 
     throw error;
   }

   const cart = await Cart.findOne({ user_id: userId });
   if (!cart) { 
     const error = new Error('Cart not found'); 
     error.status = 404; 
     throw error;
   }

   cart.items = cart.items.filter(item => !(item.product_id.toString() === product_id && item.size === Number(size)));
   await cart.save();
   
   return cart;
};

export default removeService;
