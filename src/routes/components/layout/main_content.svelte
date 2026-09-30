<script lang="ts">
  import KanbanBoard from '../kanban_board.svelte';
  import { translate, selectedProjectId } from '$lib';
</script>

<div class="flex-1 h-full overflow-y-auto bg-[#090a0f] custom-scrollbar">
  <main class="h-full p-6 max-w-7xl mx-auto flex flex-col">
    {#if $selectedProjectId}
      <KanbanBoard />
    {:else}
      <div class="flex-1 flex items-center justify-center">
        <div class="max-w-md w-full p-8 rounded-xl border border-white/5 bg-[#0d0f17] text-center shadow-xl shadow-black/20">
          <div class="w-12 h-12 mx-auto mb-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h2 class="text-base font-semibold text-zinc-100 mb-1.5 tracking-tight">
            {$translate.main.welcome}
          </h2>
          <p class="text-xs text-zinc-400 leading-relaxed mb-6">
            {$translate.main.description}
          </p>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{$translate.main.initialize}</span>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>