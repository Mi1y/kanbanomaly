<script lang="ts">
  import { currentLanguage, setLanguage } from '$lib/features/translator/store';

let { isOpen = $bindable(), onClose,} = $props<{
  isOpen?: boolean;
  onClose?: () => void;
}>();


async function saveSettings() {
    onClose();
}

function handleLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    setLanguage(target.value as 'en' | 'pl' | 'de');
}

function closeModal() {
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
                Settings
            </h3>
        </div>
          <div class="space-y-5">
            <label for="language-status" class="block text-sm font-medium text-slate-300 mb-2">Language</label>
            <select 
            bind:value={$currentLanguage} 
            onchange={handleLanguageChange}
            class="p-3 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            >
                <option value="en">🇬🇧 English</option>
                <option value="pl">🇵🇱 Polski</option>
                <option value="de">🇩🇪 Deutsch</option>
            </select>
            <div class="grid grid-cols-2 gap-4">

            </div>
              <div class="flex justify-end gap-3 pt-6">
                <button
                  onclick={closeModal}
                  class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
                >
                  Cancel
                </button>

                <button
                  onclick={saveSettings}
                  class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
                >
                  Save
                </button>
            
              </div>
          </div>
      </div>
    </div>
  </div>
{/if}