import { supabase } from './supabaseClient';

export const scienceApi = {
  /**
   * Fetches all scientific articles
   */
  async getArticles() {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('scientific_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getArticles error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Fetches a single scientific article by slug
   */
  async getArticleBySlug(slug) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('scientific_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Supabase getArticleBySlug error for slug ${slug}:`, error.message);
      throw error;
    }
    return data;
  },

  /**
   * Creates a scientific article
   */
  async createArticle(articleData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('scientific_articles')
      .insert([articleData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing scientific article
   */
  async updateArticle(articleData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { id, created_at, ...payload } = articleData;
    const { data, error } = await supabase
      .from('scientific_articles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a scientific article
   */
  async deleteArticle(id) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('scientific_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};
