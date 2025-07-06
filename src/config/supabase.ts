import { createClient } from '@supabase/supabase-js';

export const SUPABASE_CONFIG = {
  URL: 'https://pkbjdgvbwvijeyrlqkrb.supabase.co',
  API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYmpkZ3Zid3ZpamV5cmxxa3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NjQwMjQsImV4cCI6MjA2NzM0MDAyNH0.jVXwSggYGf5cLuWma3UEEfOBZounwc4vHkZzaII1_ME',
  TABLE_NAME: 'rankings'
};

export const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.API_KEY); 