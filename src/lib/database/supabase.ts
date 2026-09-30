import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const defaultUrl = env.PUBLIC_SUPABASE_URL || 'placeholder-url';
const defaultKey = env.PUBLIC_SUPABASE_KEY || 'placeholder-key';

let clientInstance = createClient(defaultUrl, defaultKey);

export function getSupabaseClient(): SupabaseClient {
  if (typeof localStorage !== 'undefined') {
    const customUrl = localStorage.getItem('customSupabaseUrl');
    const customKey = localStorage.getItem('customSupabaseAnonKey');
    if (customUrl && customKey) {
      return createClient(customUrl, customKey);
    }
  }
  return clientInstance;
}

export const supabase: SupabaseClient<any, 'public', any> = new Proxy({} as SupabaseClient<any, 'public', any>, {
  get(_target, prop) {
    const client = getSupabaseClient() as any;
    return client[prop];
  }
});

