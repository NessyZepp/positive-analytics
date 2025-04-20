import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

// Import environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export the typed Supabase client
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // Since we're using anonymous access
    },
    global: {
      headers: {
        'x-application-name': 'twitch-positivity',
      },
    },
  }
);
