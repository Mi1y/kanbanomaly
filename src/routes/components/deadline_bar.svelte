<script lang="ts">
  import { translate } from '$lib';

  let { newProjectStartDate, newProjectEndDate } = $props<{
    newProjectStartDate: Date | string | null;
    newProjectEndDate: Date | string | null;
  }>();

  let days = $state(0);
  let hours = $state(0);
  let minutes = $state(0);
  let percentElapsed = $state(0);

  function calculateTimeLeft() {
    if (!newProjectStartDate || !newProjectEndDate) return;
    const now = new Date().getTime();
    const start = new Date(newProjectStartDate).getTime();
    const end = new Date(newProjectEndDate).getTime();
    const diff = end - now;

    if (diff <= 0) {
      days = hours = minutes = 0;
      percentElapsed = 100;
      return;
    }

    const totalMinutes = Math.floor(diff / (1000 * 60));
    days = Math.floor(totalMinutes / (60 * 24));
    hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    minutes = totalMinutes % 60;

    const totalDuration = end - start;
    const elapsed = now - start;
    if (totalDuration > 0) {
      percentElapsed = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    } else {
      percentElapsed = 100;
    }
  }

  $effect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60_000);
    return () => clearInterval(interval);
  });
</script>

{#if newProjectStartDate && newProjectEndDate}
  <div class="rounded-xl border border-white/5 bg-[#0d0f17] p-4 mb-6 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full {days <= 3 ? 'bg-rose-400' : days <= 14 ? 'bg-amber-400' : 'bg-emerald-400'}"></span>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          {$translate.deadline.tracker}
        </h2>
      </div>
      
      <div class="text-[11px] font-mono text-zinc-400">
        <span class="text-zinc-200 font-medium">{Math.round(percentElapsed)}%</span> elapsed
      </div>
    </div>

    <div class="w-full h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden mb-4">
      <div 
        class="h-full rounded-full transition-all duration-700 ease-out {percentElapsed > 90 ? 'bg-rose-500' : percentElapsed > 75 ? 'bg-amber-500' : 'bg-indigo-500'}"
        style="width: {percentElapsed}%;"
      ></div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white/[0.02] border border-white/5 rounded-lg py-2 text-center">
        <div class="text-lg font-semibold font-mono text-zinc-100">{days}</div>
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider">{$translate.deadline.days}</div>
      </div>

      <div class="bg-white/[0.02] border border-white/5 rounded-lg py-2 text-center">
        <div class="text-lg font-semibold font-mono text-zinc-100">{hours}</div>
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider">{$translate.deadline.hours}</div>
      </div>

      <div class="bg-white/[0.02] border border-white/5 rounded-lg py-2 text-center">
        <div class="text-lg font-semibold font-mono text-zinc-100">{minutes}</div>
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider">{$translate.deadline.minutes}</div>
      </div>
    </div>
  </div>
{/if}