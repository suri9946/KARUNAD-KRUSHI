import { supabase } from './supabaseClient';

export const contentApi = {
  /**
   * Fetches all site content settings from Supabase site_content table
   */
  async getSiteContent() {
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('*');

    if (error) {
      console.error('Error fetching site content from Supabase:', error.message);
      throw error;
    }

    // Map array of { key, value } to a single lookup object { [key]: value }
    const contentMap = {};
    if (data) {
      data.forEach(row => {
        contentMap[row.key] = row.value;
      });
    }
    return contentMap;
  },

  /**
   * Saves or updates a site content key in Supabase
   */
  async saveSiteContent(key, value) {
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('site_content')
      .upsert({ key, value })
      .select()
      .single();

    if (error) {
      console.error(`Error saving site content for key "${key}":`, error.message);
      throw error;
    }
    return data;
  }
};
