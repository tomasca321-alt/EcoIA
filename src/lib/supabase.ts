import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlowvkwcmqlixxwvrjjw.supabase.co';
const supabaseKey = 'sb_publishable_lFu141Kvpsnixu8okKuVIg_ZoRWLGnP';

export const supabase = createClient(supabaseUrl, supabaseKey);
