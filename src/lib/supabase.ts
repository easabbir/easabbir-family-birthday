import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const initSupabase = (url: string, key: string) => {
  if (!url || !key) {
    supabaseClient = null;
    return null;
  }
  try {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (e) {
    console.error('Supabase init error:', e);
    supabaseClient = null;
    return null;
  }
};

export const getSupabase = () => supabaseClient;

// Initial check for environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (envUrl && envKey) {
  initSupabase(envUrl, envKey);
}
