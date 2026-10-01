<script lang="ts">
  import KanbanBoard from '../kanban_board.svelte';
  import { base } from '$app/paths';
  import { translate, selectedProjectId } from '$lib';
</script>

<div class="flex-1 h-full overflow-y-auto bg-[#090a0f] custom-scrollbar">
  <main class="h-full p-6 max-w-7xl mx-auto flex flex-col">
    {#if $selectedProjectId}
      <KanbanBoard />
    {:else}
      <div class="flex-1 flex items-center justify-center">
        <div class="max-w-md w-full p-8 rounded-xl border border-white/5 bg-[#0d0f17] text-center shadow-xl shadow-black/20">
          <div class="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center">
            <img src="{base}/favicon.svg" alt="Kanbanomaly" class="w-14 h-14 object-contain" />
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