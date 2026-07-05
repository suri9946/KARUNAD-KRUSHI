import { supabase } from './supabaseClient';

export const seoApi = {
  /**
   * Fetches SEO settings for all routes
   */
  async getSEOSettings() {
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('seo_settings')
      .select('*');

    if (error) {
      console.error('Error fetching SEO settings from Supabase:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Saves or updates SEO settings for a specific page route
   */
  async saveSEOSettings(pageId, settings) {
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('seo_settings')
      .upsert({
        page_id: pageId,
        title: settings.title,
        meta_description: settings.meta_description,
        keywords: settings.keywords,
        og_image: settings.og_image
      })
      .select()
      .single();

    if (error) {
      console.error(`Error saving SEO settings for page "${pageId}":`, error.message);
      throw error;
    }
    return data;
  }
};
