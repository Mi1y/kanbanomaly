<script lang="ts">
import { 
  currentLanguage, 
  setLanguage, 
  translate, 
  toastActions,
  exportImportService,
  resetDemoData,
  projectActions,
} from '$lib';
import KeyboardShortcut from '../keyboard_shortcut.svelte';

let { isOpen = $bindable(), onClose } = $props<{
  isOpen?: boolean;
  onClose?: () => void;
}>();

let selectedLanguage = $state($currentLanguage);
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

async function handleResetDemo() {
  try {
    resetDemoData();
    await projectActions.loadAll();
    toastActions.success($translate.toasts.other.demoReset);
  } catch {
    toastActions.error($translate.toasts.error.unexpected);
  }
}

async function saveSettings() {
  setLanguage(selectedLanguage);
  toastActions.success($translate.toasts.success.settingsSuccess);
  closeModal();
}

function closeModal() {
  isOpen = false;
  onClose?.();
}
</script>

<KeyboardShortcut onEscape={closeModal} />

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    <div 
      class="w-full max-w-md bg-[#0d0f17] border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
    >
      <div class="flex items-center justify-between pb-4 border-b border-white/5">
        <h3 class="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {$translate.ui.settings}
        </h3>
        <button 
          onclick={closeModal}
          class="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4 pt-4">
        <div>
          <label for="language-select" class="block text-xs font-medium text-zinc-400 mb-1.5">
            {$translate.ui.language}
          </label>
          <select 
            id="language-select"
            bind:value={selectedLanguage}
            class="w-full text-xs bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="en" class="bg-[#161822]">English</option>
            <option value="pl" class="bg-[#161822]">Polski</option>
            <option value="de" class="bg-[#161822]">Deutsch</option>
          </select>
        </div>

        <div class="space-y-3 pt-3 border-t border-white/5">
          <div class="flex items-center justify-between">
            <span class="block text-xs font-medium text-zinc-400">
              {$translate.ui.storageMode}
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {$translate.ui.demoModeLabel}
            </span>
          </div>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            {$translate.ui.demoModeDesc}
          </p>
          <button
            type="button"
            onclick={handleResetDemo}
            class="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-lg text-xs font-medium text-zinc-300 transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>{$translate.ui.resetDemo}</span>
          </button>
        </div>

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
