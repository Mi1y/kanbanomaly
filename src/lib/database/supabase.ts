import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// production environment variables
// import { env } from '$env/dynamic/private';

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseKey = env.PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be set in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
