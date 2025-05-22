<!-- Display the component only if end_date is provided, otherwise do not display it -->
{#if newProjectStartDate && newProjectEndDate }
<div class="bg-gray text-center font-mono pt-12">
    <h1 class="text-2xl font-bold">Deadline Loading</h1>
  
    <div class="relative my-10 mx-auto w-4/5 h-8 bg-white rounded-full overflow-hidden">
      <div
      class="absolute top-0 left-0 bg-red-500 bg-opacity-50 transition-all duration-1000 h-full border border-red-700"        style="width: {maskWidth}%"
        style:z-index="0"
      ></div>
  
        <div
        id="skull"
        class="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-1000 flex items-center"
        style="left: calc({maskWidth}% - 1.5rem)"
        style:z-index="10"
        >
        {#if days > 0}
            💀
        {/if}
        </div>
        
        <div id="employee" class="absolute top-1/2 right-2 transform -translate-y-1/2 text-2xl" style:z-index="5">
        {#if days > 0}
            👨‍💻
        {/if}
        {#if days === 0}
        <span class="ml-2 text-white animate-pulse absolute top-1/2 right-2 transform -translate-y-1/2 text-2xl">
            👻
        </span>
        {/if}
        </div>
        
    </div>
  
    <div class="mt-5 text-lg">
      Deadline: 
      {days}d {hours}h {minutes}m
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
        return;
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
  