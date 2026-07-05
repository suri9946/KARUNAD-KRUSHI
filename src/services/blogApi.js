import { supabase } from './supabaseClient';

export const blogApi = {
  /**
   * Fetches all blog articles
   */
  async getBlogs() {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Supabase getBlogs error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Fetches a single blog post by slug
   */
  async getBlogBySlug(slug) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Supabase getBlogBySlug error for slug ${slug}:`, error.message);
      throw error;
    }
    return data;
  },

  /**
   * Creates a new blog article
   */
  async createBlog(blogData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        ...blogData,
        published_at: blogData.status === 'published' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing blog article
   */
  async updateBlog(blogData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { id, created_at, updated_at, ...payload } = blogData;
    const { data, error } = await supabase
      .from('blogs')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
        published_at: payload.status === 'published' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a blog article
   */
  async deleteBlog(id) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};
