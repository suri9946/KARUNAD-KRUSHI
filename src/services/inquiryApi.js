import { supabase } from './supabaseClient';

export const inquiryApi = {
  /**
   * Fetches all inquiries (Admin Only)
   */
  async getInquiries() {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getInquiries error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Submits a contact inquiry form
   */
  async saveInquiry(inquiryData) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        message: inquiryData.message,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an inquiry's status (Admin only)
   */
  async updateInquiryStatus(id, status) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes an inquiry (Admin only)
   */
  async deleteInquiry(id) {
    if (!supabase) throw new Error('Supabase client is not initialized.');

    const { data, error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};
