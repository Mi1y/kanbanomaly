<script lang="ts">
import KanbanBoard from '../kanban_board.svelte';
import { translate } from '$lib';
import { selectedProjectId } from '$lib/supabase';

</script>

<div class="flex-1 overflow-y-auto bg-slate-900/50 custom-scrollbar">
  <main class="p-6 relative">
    {#if $selectedProjectId}
      <KanbanBoard/>
    {:else}
      <div class="bg-slate-800/60 p-12 rounded-xl text-center border border-purple-500/20 relative overflow-hidden">
        <div class="bg-gradient-to-br from-purple-600/10 to-transparent rounded-xl"></div>
        
        <div class="relative">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            {$translate.main.welcome}
          </h2>
          <p class="text-slate-400 text-lg mb-6 max-w-md mx-auto">
            {$translate.main.description} ☕️
          </p>
          <div class="flex items-center justify-center gap-4 text-sm text-slate-500">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{$translate.main.initialize}</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>