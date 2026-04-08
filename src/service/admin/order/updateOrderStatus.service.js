/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import Order from '../../../model/order.model.js';
import Product from '../../../model/product.model.js';

const updateOrderStatusService = async (id, data) => {
  const { status, payment_status } = data;

  const order = await Order.findById(id);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  // Handle Inventory (Stock) logic when status changes
  if (status && status !== order.status) {
    const isApproving =
      order.status === 'pending' &&
      status !== 'pending' &&
      status !== 'cancelled';
    const isCancelling =
      order.status !== 'pending' &&
      order.status !== 'cancelled' &&
      status === 'cancelled';

    if (isApproving) {
      // 1. Check stock for all items BEFORE deducting anything
      for (const item of order.items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          const error = new Error(
            `Product ${item.product_name} no longer exists in database.`,
          );
          error.statusCode = 400;
          throw error;
        }

        const sizeObj = product.sizes.find((s) => s.size === item.size);
        if (!sizeObj || sizeObj.quantity < item.quantity) {
          const error = new Error(
            `Not enough stock for product ${item.product_name} (Size: ${item.size}). Available: ${sizeObj ? sizeObj.quantity : 0}, Required: ${item.quantity}`,
          );
          error.statusCode = 400;
          throw error;
        }
      }

      // 2. Deduct stock for all items
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product_id, 'sizes.size': item.size },
          { $inc: { 'sizes.$.quantity': -item.quantity } },
        );
      }
    } else if (isCancelling) {
      // Add stock back
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product_id, 'sizes.size': item.size },
          { $inc: { 'sizes.$.quantity': item.quantity } },
        );
      }
    }
  }

  // Update order fields
  const updateData = {};
  if (status) updateData.status = status;
  if (payment_status) updateData.payment_status = payment_status;

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).exec();

  return updatedOrder;
};

export default updateOrderStatusService;
