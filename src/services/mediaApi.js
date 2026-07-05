import { supabase } from './supabaseClient';

export const mediaApi = {
  /**
   * Fetches all gallery assets
   */
  async getGalleryAssets() {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase getGalleryAssets error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Uploads an image file to Supabase Storage bucket and stores metadata in gallery table
   * @param {File} file - Browser File object
   * @param {string} bucket - Target storage bucket (default: 'site-assets')
   * @param {string} title - Human-readable name for the asset
   * @param {string} caption - Details or context
   */
  async uploadMedia(file, bucket = 'site-assets', title = '', caption = '') {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 1. Upload raw binary to storage bucket
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Resolve public URL for the newly uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // 3. Register metadata in gallery table
    const { data: asset, error: dbError } = await supabase
      .from('gallery')
      .insert([{
        title: title || file.name,
        image_url: publicUrl,
        caption: caption,
        display_order: 10
      }])
      .select()
      .single();

    if (dbError) throw dbError;
    return asset;
  },

  /**
   * Deletes an asset from storage and catalog metadata
   */
  async deleteMedia(id, imageUrl, bucket = 'site-assets') {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    // Attempt to extract filePath from public URL mapping
    // Format: .../storage/v1/object/public/bucketName/filePath
    try {
      const urlParts = imageUrl.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from(bucket).remove([filePath]);
      }
    } catch (err) {
      console.warn('Could not extract storage path to delete raw file:', err);
    }

    // Delete database register
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
