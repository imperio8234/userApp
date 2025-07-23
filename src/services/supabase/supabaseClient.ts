import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_URL_SUPABASE;
const supabaseAnonKey = import.meta.env.VITE_key_supabase;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);