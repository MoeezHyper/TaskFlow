import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let defaultSupabaseClient = null;
let isSupabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')) {
  try {
    defaultSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseConfigured = true;
    console.log('Supabase client initialized successfully.');
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err.message);
  }
} else {
  console.warn('Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) not configured or set to placeholder.');
}

export const getSupabaseClient = () => {
  return isSupabaseConfigured ? defaultSupabaseClient : null;
};

export const isConfigured = () => isSupabaseConfigured;

