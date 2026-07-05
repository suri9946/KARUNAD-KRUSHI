import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'CRITICAL: Supabase credentials (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are missing from your environment configuration.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
