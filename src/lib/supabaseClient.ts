import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://juuuecgkbporoapacaaz.supabase.co';
const supabaseAnonKey = 'sb_publishable_7iXj2xVK_DW3gk_3s8riMA_3lVNE9go';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
