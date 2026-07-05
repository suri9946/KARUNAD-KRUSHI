import { supabase } from './supabaseClient';

export const orderApi = {
  /**
   * Fetches all orders (Admin Only)
   */
  async getOrders() {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getOrders error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Updates an order status (Admin Only)
   */
  async updateOrderStatus(id, status) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase updateOrderStatus error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Deletes an order (Admin Only)
   */
  async deleteOrder(id) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase deleteOrder error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Saves a new order and decrements variant inventory
   */
  async saveOrder(orderData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { customer, items, total } = orderData;

    // Insert order to database using flat schema fields
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        shipping_address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.zip}`,
        billing_address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.zip}`,
        payment_status: 'completed', // Simulated completion
        payment_method: orderData.payment?.method || 'Online',
        transaction_id: `TXN-${Date.now()}`,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          variantSku: item.variant.sku,
          size: item.variant.size,
          price: item.variant.price,
          quantity: item.quantity
        })),
        subtotal: Number(total),
        total: Number(total)
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Decrement stock for variants using individual queries
    try {
      for (const item of items) {
        // Fetch current stock
        const { data: variant, error: fetchError } = await supabase
          .from('product_variants')
          .select('stock')
          .eq('sku', item.variant.sku)
          .single();
        
        if (!fetchError && variant) {
          const newStock = Math.max(0, variant.stock - item.quantity);
          await supabase
            .from('product_variants')
            .update({ stock: newStock })
            .eq('sku', item.variant.sku);
        }
      }
    } catch (stockErr) {
      console.error('Failed to decrement stock in Supabase variant table:', stockErr);
    }

    // Return object compatible with the receipt page UI
    return {
      id: order.id,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip
      },
      items: items.map(item => ({
        name: item.product.name,
        size: item.variant.size,
        price: item.variant.price,
        quantity: item.quantity
      })),
      total: order.total
    };
  }
};
