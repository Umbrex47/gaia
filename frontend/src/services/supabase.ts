import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
  'https://obbmwegpqkmjoryohybu.supabase.co';

const supabaseAnonKey: string =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_CEN3bqoD94IYm6t22eiJdg_-VVKa-zG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
