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
} from '$lib';
import type { DataSource } from '$lib';

let { isOpen = $bindable(), onClose } = $props<{
  isOpen?: boolean;
  onClose?: () => void;
}>();

let selectedLanguage = $state($currentLanguage);
let selectedDataSource = $state<DataSource>($dataSource);
let supabaseUrlVal = $state($customSupabaseUrl);
let supabaseKeyVal = $state($customSupabaseAnonKey);

async function saveSettings() {
  setLanguage(selectedLanguage);

  const sourceChanged = selectedDataSource !== $dataSource;
  dataSource.set(selectedDataSource);
  customSupabaseUrl.set(supabaseUrlVal.trim());
  customSupabaseAnonKey.set(supabaseKeyVal.trim());

  if (sourceChanged) {
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

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  :global(.animate-fade-in) {
    animation: fade-in 0.2s ease-out;
  }
  :global(.animate-scale-in) {
    animation: scale-in 0.2s ease-out;
  }
</style>

{#if isOpen}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
    <div class="bg-slate-800 rounded-xl p-8 w-full max-w-md border border-purple-500/30 relative overflow-hidden animate-scale-in">
      <div class="bg-gradient-to-br from-purple-600/10 to-transparent"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
            <h3 class="text-xl font-bold text-white">
                {$translate.ui.settings}
            </h3>
        </div>
          <div class="space-y-5">
            <label for="language-status" class="block text-sm font-medium text-slate-300 mb-2">{$translate.ui.language}</label>
            <select 
              bind:value={selectedLanguage}
              class="bg-slate-700/60 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
              >
                <option value="en">🇬🇧 English</option>
                <option value="pl">🇵🇱 Polski</option>
                <option value="de">🇩🇪 Deutsch</option>
            </select>
            <div>
              <label for="storage-mode" class="block text-sm font-medium text-slate-300 mb-2">
                {$translate.ui.storageMode || 'Storage Mode'}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onclick={() => selectedDataSource = 'local'}
                  class="px-4 py-2.5 rounded-lg text-sm font-medium border transition-all {selectedDataSource === 'local' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:text-white'}"
                >
                  Local (Files)
                </button>
                <button
                  type="button"
                  onclick={() => selectedDataSource = 'supabase'}
                  class="px-4 py-2.5 rounded-lg text-sm font-medium border transition-all {selectedDataSource === 'supabase' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:text-white'}"
                >
                  Supabase
                </button>
              </div>
            </div>

            {#if selectedDataSource === 'supabase'}
              <div class="space-y-3 pt-2 border-t border-slate-700/50">
                <div>
                  <label for="supabase-url" class="block text-xs font-medium text-slate-400 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    id="supabase-url"
                    type="text"
                    bind:value={supabaseUrlVal}
                    placeholder="https://xyz.supabase.co"
                    class="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-white text-sm focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label for="supabase-anon" class="block text-xs font-medium text-slate-400 mb-1">
                    Supabase Anon Key
                  </label>
                  <input
                    id="supabase-anon"
                    type="password"
                    bind:value={supabaseKeyVal}
                    placeholder="eyJhbGciOi..."
                    class="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-white text-sm focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            {/if}
              <div class="flex justify-end gap-3 pt-6">
                <button
                  onclick={closeModal}
                  class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
                >
                  {$translate.global.cancel}
                </button>

                <button
                  onclick={saveSettings}
                  class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
                >
                  {$translate.global.save}
                </button>
            
              </div>
          </div>
      </div>
    </div>
  </div>
{/if}