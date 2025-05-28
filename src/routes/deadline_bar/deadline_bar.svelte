<!-- Display the component only if end_date is provided, otherwise do not display it -->
{#if newProjectStartDate && newProjectEndDate}
<div class="bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 relative overflow-hidden">
  <!-- Subtle background glow -->
  <div class="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-red-600/5 rounded-xl"></div>
  
  <div class="relative z-10">
    <!-- Header -->
    <div class="flex items-center justify-center gap-3 mb-6">
      <div class="w-3 h-3 rounded-full {days <= 7 ? 'bg-red-400 animate-pulse' : days <= 30 ? 'bg-yellow-400' : 'bg-emerald-400'}"></div>
      <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono tracking-wider">
        DEADLINE TRACKER
      </h1>
    </div>

    <!-- Progress bar container -->
    <div class="relative mx-auto w-full max-w-2xl h-12 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50 shadow-inner">
      <!-- Background track -->
      <div class="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full"></div>
      
      <!-- Progress fill -->
      <div
        class="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full {maskWidth > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : maskWidth > 60 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}"
        style="width: {maskWidth}%"
      >
        <!-- Inner glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
      </div>

      <!-- Skull indicator -->
      {#if days > 0}
        <div
          class="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-2xl transition-all duration-1000 filter drop-shadow-lg"
          style="left: {maskWidth}%"
        >
          {#if days <= 3}
            💀
          {:else if days <= 7}
            ⚠️
          {:else}
            🎯
          {/if}
        </div>
      {/if}

      <!-- Employee/Ghost indicator -->
      <div class="absolute top-1/2 right-3 transform -translate-y-1/2 text-2xl">
        {#if days > 0}
          👨‍💻
        {:else}
          <span class="text-red-400 animate-pulse">👻</span>
        {/if}
      </div>
    </div>

    <!-- Time display -->
    <div class="mt-6 text-center">
      <div class="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <!-- Days -->
        <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
          <div class="text-2xl font-bold text-white font-mono">{days}</div>
          <div class="text-xs text-slate-400 uppercase tracking-wider">Days</div>
        </div>
        
        <!-- Hours -->
        <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
          <div class="text-2xl font-bold text-white font-mono">{hours}</div>
          <div class="text-xs text-slate-400 uppercase tracking-wider">Hours</div>
        </div>
        
        <!-- Minutes -->
        <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
          <div class="text-2xl font-bold text-white font-mono">{minutes}</div>
          <div class="text-xs text-slate-400 uppercase tracking-wider">Minutes</div>
        </div>
      </div>

      <!-- Status message -->
      <div class="mt-4 text-sm text-slate-400">
        {#if days === 0 && hours === 0 && minutes === 0}
          <span class="text-red-400 font-medium">⚠️ DEADLINE REACHED</span>
        {:else if days <= 1}
          <span class="text-red-400 font-medium">🚨 CRITICAL: Less than 24h remaining</span>
        {:else if days <= 7}
          <span class="text-orange-400 font-medium">⚡ WARNING: Less than a week remaining</span>
        {:else if days <= 30}
          <span class="text-yellow-400 font-medium">⏰ NOTICE: Less than a month remaining</span>
        {:else}
          <span class="text-emerald-400 font-medium">✅ ON TRACK: Good time buffer</span>
        {/if}
      </div>
    </div>

    <!-- Progress -->
    <div class="mt-4 text-center">
      <div class="inline-flex items-center gap-2 text-xs text-slate-500">
        <span>Progress:</span>
        <span class="font-mono text-purple-400">{Math.round(maskWidth)}%</span>
        <div class="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style="width: {maskWidth}%"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
{/if}

<script>
  export let newProjectEndDate, newProjectStartDate;
  let days = 0, hours = 0, minutes = 0;
  let totalDays = 0, totalTimeMs = 0;
  let maskWidth = 0;

  const calculateTimeLeft = () => {
    const now = new Date();
    const end = new Date(newProjectEndDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      days = hours = minutes = 0;
      return { days: 0, hours: 0, minutes: 0, diff: 0 };
    }

    const totalMinutes = Math.floor(diff / (1000 * 60));
    days = Math.floor(totalMinutes / (60 * 24));
    hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    minutes = totalMinutes % 60;

    if (totalDays === 0) {
      totalDays = days;
    }
    return { days, hours, minutes, diff };
  };

  const startCountdown = () => {
    calculateTimeLeft();
    updateAnimation();

    const interval = setInterval(() => {
      calculateTimeLeft();
      updateAnimation();

      if (days <= 0 && hours <= 0 && minutes <= 0) {
        clearInterval(interval);
      }
    }, 60_000); 
  };

  const updateAnimation = () => {
    const now = new Date().getTime();
    const start = new Date(newProjectStartDate).getTime();
    const elapsed = now - start;
    maskWidth = Math.min((elapsed / totalTimeMs) * 100, 100);
  };

  const initializeCountdown = () => {
    const start = new Date(newProjectStartDate).getTime();
    const end = new Date(newProjectEndDate).getTime();
    totalTimeMs = end - start;
    
    const result = calculateTimeLeft();
    if (result.diff > 0) {
      updateAnimation();
      startCountdown();
    }
  };

  // show the countdown only if newProjectEndDate && newProjectStartDate is provided
  $: if (newProjectStartDate && newProjectEndDate) {
    initializeCountdown();
  }
</script>