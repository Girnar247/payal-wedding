import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vztjldlvnklafclbinnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dGpsZGx2bmtsYWZjbGJpbm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MTcsImV4cCI6MjAyNTM5ODQxN30.vxjjXPU8HJ8xZXv4Gj_QXFDQXCGLf_R_Q9nHO_jBJQY';

export const supabase = createClient(supabaseUrl, supabaseKey);