import { supabase } from './supabaseClient';

export const productApi = {
  /**
   * Fetches all products including their variants
   */
  async getProducts() {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*)');

    if (error) {
      console.error('Supabase getProducts error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Fetches a single product by slug including variants
   */
  async getProductBySlug(slug) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Supabase getProductBySlug error for slug ${slug}:`, error.message);
      throw error;
    }
    return data;
  },

  /**
   * Creates a product and its variants
   */
  async createProduct(productData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { variants, ...productPayload } = productData;

    // Insert product
    const { data: product, error: prodError } = await supabase
      .from('products')
      .insert([productPayload])
      .select()
      .single();

    if (prodError) throw prodError;

    // Insert variants if any
    if (variants && variants.length > 0) {
      const variantsPayload = variants.map((v, idx) => ({
        product_id: product.id,
        sku: v.sku || `SKU-${product.slug}-${idx}-${Date.now()}`,
        size: v.size || v.weight,
        price: Number(v.price),
        stock: Number(v.stock)
      }));

      const { error: varError } = await supabase
        .from('product_variants')
        .insert(variantsPayload);

      if (varError) throw varError;
    }

    return product;
  },

  /**
   * Updates an existing product and its variants
   */
  async updateProduct(productData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { id, variants, created_at, updated_at, ...productPayload } = productData;

    // Update product fields
    const { data: product, error: prodError } = await supabase
      .from('products')
      .update({ ...productPayload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (prodError) throw prodError;

    // Delete existing variants and re-insert new ones (simple & robust replacement)
    if (variants) {
      const { error: delError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id);

      if (delError) throw delError;

      if (variants.length > 0) {
        const variantsPayload = variants.map((v, idx) => ({
          product_id: id,
          sku: v.sku || `SKU-${product.slug}-${idx}-${Date.now()}`,
          size: v.size || v.weight,
          price: Number(v.price),
          stock: Number(v.stock)
        }));

        const { error: insError } = await supabase
          .from('product_variants')
          .insert(variantsPayload);

        if (insError) throw insError;
      }
    }

    return product;
  },

  /**
   * Deletes a product from the database
   */
  async deleteProduct(id) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};
