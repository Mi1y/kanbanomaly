import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const defaultUrl = env.PUBLIC_SUPABASE_URL || 'placeholder-url';
const defaultKey = env.PUBLIC_SUPABASE_KEY || 'placeholder-key';

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function resetSupabaseClient() {
  cachedClient = null;
  lastUsedUrl = '';
  lastUsedKey = '';
}

export function getSupabaseClient(): SupabaseClient {
  let targetUrl = defaultUrl;
  let targetKey = defaultKey;

  if (typeof localStorage !== 'undefined') {
    const customUrl = localStorage.getItem('customSupabaseUrl');
    const customKey = localStorage.getItem('customSupabaseAnonKey');
    if (customUrl && customKey) {
      targetUrl = customUrl;
      targetKey = customKey;
    }
  }

  if (!cachedClient || lastUsedUrl !== targetUrl || lastUsedKey !== targetKey) {
    cachedClient = createClient(targetUrl, targetKey);
    lastUsedUrl = targetUrl;
    lastUsedKey = targetKey;
  }

  return cachedClient;
}

export const supabase: SupabaseClient<any, 'public', any> = new Proxy({} as SupabaseClient<any, 'public', any>, {
  get(_target, prop) {
    const client = getSupabaseClient() as any;
    return client[prop];
  }
});

