import { createClient } from '@supabase/supabase-js';

// REPLACE these with your actual URL and Anon Key from the Supabase dashboard
const supabaseUrl = 'https://torrovtotkpyjtlkwkhb.supabase.co';
const supabaseKey = 'sb_publishable_Zn3dvzUQhyqdNQrhF25y5Q_M0iSYGe9';

export const supabase = createClient(supabaseUrl, supabaseKey);