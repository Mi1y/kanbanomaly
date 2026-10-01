import { writable } from 'svelte/store';

export type DataSource = 'demo';

export const dataSource = writable<DataSource>('demo');
