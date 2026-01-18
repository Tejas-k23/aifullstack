/**
 * Supabase Client Configuration
 * Uses service role key for server-side operations
 */

import { createClient } from '@supabase/supabase-js';
import config from './env.js';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Service Role Key must be provided');
}

// Create Supabase client with service role key (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
