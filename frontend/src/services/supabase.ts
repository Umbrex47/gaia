import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://qdligwkcosqswywfbxzp.supabase.co';

const supabaseAnonKey: string =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_tcgySEdCb0eeCzxwxV7zrg_obbAuneZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
