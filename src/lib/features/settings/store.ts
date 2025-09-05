import { writable } from 'svelte/store';

const local = $state('local');
const supabase = $state('supabase');
type DataSource = typeof local | typeof supabase;

export const dataSource = writable<DataSource>('local');