import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-key';

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function resetSupabaseClient() {
  cachedClient = null;
  lastUsedUrl = '';
  lastUsedKey = '';
}

export function getSupabaseClient(): SupabaseClient {
  let targetUrl = FALLBACK_URL;
  let targetKey = FALLBACK_KEY;

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

