<script lang="ts">
import { 
  currentLanguage, 
  setLanguage, 
  translate, 
  toastActions,
  dataSource,
  customSupabaseUrl,
  customSupabaseAnonKey,
  projectActions,
  taskActions,
  exportImportService,
  resetSupabaseClient,
} from '$lib';
import KeyboardShortcut from '../keyboard_shortcut.svelte';
import type { DataSource } from '$lib';

let { isOpen = $bindable(), onClose } = $props<{
  isOpen?: boolean;
  onClose?: () => void;
}>();

let selectedLanguage = $state($currentLanguage);
let selectedDataSource = $state<DataSource>($dataSource);
let supabaseUrlVal = $state($customSupabaseUrl);
let supabaseKeyVal = $state($customSupabaseAnonKey);
let backupFileInput: HTMLInputElement | undefined = $state();

async function handleExportAll() {
  try {
    const count = await exportImportService.exportAllProjects();
    toastActions.success(`${$translate.toasts.other.backupSuccess}: ${count}`);
  } catch {
    toastActions.error($translate.toasts.error.unexpected);
  }
}

async function handleBackupFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const count = await exportImportService.importFromJson(text);
    toastActions.success(`${$translate.toasts.other.importSuccess}: ${count}`);
  } catch {
    toastActions.error($translate.toasts.other.importFailed);
  } finally {
    input.value = '';
  }
}

async function saveSettings() {
  setLanguage(selectedLanguage);

  const prevSource = $dataSource;
  const prevUrl = $customSupabaseUrl;
  const prevKey = $customSupabaseAnonKey;

  const nextUrl = supabaseUrlVal.trim();
  const nextKey = supabaseKeyVal.trim();

  const sourceChanged = selectedDataSource !== prevSource;
  const credentialsChanged = nextUrl !== prevUrl || nextKey !== prevKey;

  dataSource.set(selectedDataSource);
  customSupabaseUrl.set(nextUrl);
  customSupabaseAnonKey.set(nextKey);

  if (credentialsChanged) {
    resetSupabaseClient();
  }

  if (sourceChanged || credentialsChanged) {
    projectActions.select(null);
    taskActions.loadForProject(null);
    await projectActions.loadAll();
  }

  toastActions.success($translate.toasts.success.settingsSuccess);
  onClose?.();
}

function resetSettings() {
  selectedLanguage = $currentLanguage;
  selectedDataSource = $dataSource;
  supabaseUrlVal = $customSupabaseUrl;
  supabaseKeyVal = $customSupabaseAnonKey;
}

function closeModal() {
  resetSettings();
  onClose?.();
}
</script>

{#if isOpen}
  <KeyboardShortcut onEscape={closeModal} />
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-[#0f111a] rounded-xl p-6 w-full max-w-lg border border-white/10 shadow-2xl shadow-black/50 relative overflow-hidden">
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h2 class="text-sm font-semibold text-zinc-100 tracking-tight">{$translate.ui.settings}</h2>
        </div>
        <button onclick={closeModal} aria-label="Close modal" class="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label for="language-select" class="block text-xs font-medium text-zinc-400 mb-1.5">
            {$translate.ui.language}
          </label>
          <select 
            id="language-select"
            bind:value={selectedLanguage}
            class="w-full text-xs bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="en" class="bg-[#161822]">English</option>
            <option value="pl" class="bg-[#161822]">Polski</option>
            <option value="de" class="bg-[#161822]">Deutsch</option>
          </select>
        </div>

        <div>
          <span class="block text-xs font-medium text-zinc-400 mb-1.5">
            {$translate.ui.storageMode || 'Storage Mode'}
          </span>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              onclick={() => selectedDataSource = 'local'}
              class="px-3 py-2 rounded-lg text-xs font-medium border transition-all text-center {selectedDataSource === 'local' ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300' : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}"
            >
              Local (Files)
            </button>
            <button
              type="button"
              onclick={() => selectedDataSource = 'supabase'}
              class="px-3 py-2 rounded-lg text-xs font-medium border transition-all text-center {selectedDataSource === 'supabase' ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300' : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}"
            >
              Cloud (Supabase)
            </button>
          </div>
        </div>

        {#if selectedDataSource === 'supabase'}
          <div class="space-y-3 pt-3 border-t border-white/5">
            <div>
              <label for="supabase-url" class="block text-[11px] font-medium text-zinc-400 mb-1">
                Supabase Project URL
              </label>
              <input
                id="supabase-url"
                type="text"
                bind:value={supabaseUrlVal}
                placeholder="https://xyz.supabase.co"
                class="w-full text-xs px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label for="supabase-anon" class="block text-[11px] font-medium text-zinc-400 mb-1">
                Supabase Anon Key
              </label>
              <input
                id="supabase-anon"
                type="password"
                bind:value={supabaseKeyVal}
                placeholder="eyJhbGciOi..."
                class="w-full text-xs px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
          </div>
        {/if}

        <div class="space-y-3 pt-3 border-t border-white/5">
          <span class="block text-xs font-medium text-zinc-400 mb-1">
            {$translate.ui.backupAndData || 'Backup & Data'}
          </span>
          <p class="text-[11px] text-zinc-500">
            {$translate.ui.backupDescription || 'Export your boards as JSON or restore projects from a backup file.'}
          </p>

          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              onclick={handleExportAll}
              class="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-lg text-xs font-medium text-zinc-300 transition-colors"
            >
              <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>{$translate.ui.exportAll || 'Export All'}</span>
            </button>

            <button
              type="button"
              onclick={() => backupFileInput?.click()}
              class="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-lg text-xs font-medium text-zinc-300 transition-colors"
            >
              <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span>{$translate.ui.importJson || 'Import JSON'}</span>
            </button>
          </div>
          <input
            type="file"
            accept=".json"
            class="hidden"
            bind:this={backupFileInput}
            onchange={handleBackupFileSelected}
          />
        </div>

        <div class="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div class="flex items-center gap-1.5 text-xs text-zinc-500 whitespace-nowrap">
            <span>{$translate.ui.zoomHint || 'Zoom:'}</span>
            <kbd class="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 font-mono text-[11px] shadow-sm">Ctrl +</kbd>
            <span class="text-zinc-600">/</span>
            <kbd class="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 font-mono text-[11px] shadow-sm">Ctrl -</kbd>
            <span class="text-zinc-600">/</span>
            <kbd class="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 font-mono text-[11px] shadow-sm">Ctrl 0</kbd>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              onclick={closeModal}
              class="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors"
            >
              {$translate.global.cancel}
            </button>
            <button
              onclick={saveSettings}
              class="px-4 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
            >
              {$translate.global.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}