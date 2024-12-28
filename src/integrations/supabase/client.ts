import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vztjldlvnklafclbinnv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dGpsZGx2bmtsYWZjbGJpbm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzc0MjgsImV4cCI6MjA1MDc1MzQyOH0.ZOFLG09O7prlbcQBvBwTplkTiQXdKpT2kZZHhMAoUQ4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});