import { writable } from 'svelte/store';

export type DataSource = 'local' | 'supabase';

const initialDataSource: DataSource =
  (typeof localStorage !== 'undefined' && (localStorage.getItem('dataSource') as DataSource)) || 'local';

export const dataSource = writable<DataSource>(initialDataSource);

if (typeof localStorage !== 'undefined') {
  dataSource.subscribe((val) => {
    localStorage.setItem('dataSource', val);
  });
}

export const customSupabaseUrl = writable<string>(
  (typeof localStorage !== 'undefined' && localStorage.getItem('customSupabaseUrl')) || ''
);

export const customSupabaseAnonKey = writable<string>(
  (typeof localStorage !== 'undefined' && localStorage.getItem('customSupabaseAnonKey')) || ''
);

if (typeof localStorage !== 'undefined') {
  customSupabaseUrl.subscribe(val => {
    if (val) localStorage.setItem('customSupabaseUrl', val);
    else localStorage.removeItem('customSupabaseUrl');
  });

  customSupabaseAnonKey.subscribe(val => {
    if (val) localStorage.setItem('customSupabaseAnonKey', val);
    else localStorage.removeItem('customSupabaseAnonKey');
  });
}