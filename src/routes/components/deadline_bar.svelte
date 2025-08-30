<script lang="ts">
  import { translate } from '$lib/features';

  let { newProjectStartDate, newProjectEndDate } = $props<{
    newProjectStartDate: Date | null;
    newProjectEndDate: Date | null;
  }>();

  let days = $state(0);
  let hours = $state(0);
  let minutes = $state(0);
  let maskWidth = $state(0);

  function calculateTimeLeft() {
    const now = new Date();
    const end = new Date(newProjectEndDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0 ) {
      days = hours = minutes = 0;
      maskWidth = 100;
      return;
    }

    const totalMinutes = Math.floor(diff / (1000 * 60));
    days = Math.floor(totalMinutes / (60 * 24));
    hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    minutes = totalMinutes % 60;

    const start = new Date(newProjectStartDate).getTime();
    const total = new Date(newProjectEndDate).getTime() - start;
    const elapsed = now.getTime() - start;
    maskWidth = Math.min((elapsed / total) * 100, 100);
  }

  $effect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60_000);
    return () => clearInterval(interval);
  });
  
</script>

{#if newProjectStartDate && newProjectEndDate}
  <div class="bg-slate-800/60 rounded-xl lg:p-8 border border-purple-500/20 relative overflow-hidden">
    <div class="relative">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="w-3 h-3 rounded-full {days <= 7 ? 'bg-red-400' : days <= 30 ? 'bg-yellow-400' : 'bg-emerald-400'}"></div>
        <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wide">
          {$translate.deadline.tracker}
        </h1>
      </div>

      <div 
        class="relative mx-auto w-full max-w-2xl h-12 bg-slate-700/70 rounded-full border border-slate-600/50 shadow-lg overflow-hidden"
        style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.05);"
      >
        <div
          class="h-full transition-all duration-1000 ease-out rounded-full relative
            {days > 0
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              : maskWidth > 80
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : maskWidth > 60
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
            }"
          style="width: {maskWidth}%; 
                  box-shadow: 
                    0 1px 3px rgba(0,0,0,0.2),
                    inset 0 1px 0 rgba(255,255,255,0.2),
                    inset 0 -1px 0 rgba(0,0,0,0.1);
                border-radius: 9999px;"
        >
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/15 to-transparent rounded-full"></div>
        </div>

        <div class="absolute top-1/2 right-3 transform -translate-y-1/2 text-2xl">
          {#if days > 0}
            👨‍💻
          {:else}
            <span class="text-red-400 animate-pulse">👻</span>
          {/if}
        </div>
      </div>

      <div class="mt-6 text-center">
        <div class="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <div class="text-2xl font-bold text-white font-mono">{days}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">{$translate.deadline.days}</div>
          </div>

          <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <div class="text-2xl font-bold text-white font-mono">{hours}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">{$translate.deadline.hours}</div>
          </div>

          <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <div class="text-2xl font-bold text-white font-mono">{minutes}</div>
            <div class="text-xs text-slate-400 uppercase tracking-wider">{$translate.deadline.minutes}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}