<div class="bg-black text-white text-center font-mono pt-12">
    <h1 class="text-2xl font-bold">Deadline Loading</h1>
  
    <div class="relative my-10 mx-auto w-4/5 h-8 bg-white rounded-full overflow-hidden">
      <div
        class="absolute top-0 left-0 bg-red-500 bg-opacity-50 transition-all duration-1000 h-full"
        style="width: {maskWidth}%"
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
  
    <div class="mt-5 text-lg">Deadline {days} day{days !== 1 ? 's' : ''}</div>
  </div>
  
  <script>
    let totalDays = 7;
    let days = totalDays;
    let maskWidth = 0;
  
    const updateAnimation = () => {
      maskWidth = ((totalDays - days) / totalDays) * 100;
    };
  
    const startCountdown = () => {
      const interval = setInterval(() => {
        if (days > 0) {
          days--;
          updateAnimation();
        } else {
          clearInterval(interval);
        }
      }, 1000);
    };
  
    updateAnimation();
    startCountdown();
  </script>
  