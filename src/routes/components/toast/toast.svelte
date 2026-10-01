<script lang="ts">
import { toasts, toastActions, translate } from "$lib";
import { fly } from 'svelte/transition';

let hoveredToastId: string | null = null;
const pausedToasts = new Map<string, { pauseTime: number, remainingDuration: number }>();

function getToastsStyles(toastType: string) {
    switch (toastType) {
        case 'success':
            return 'bg-emerald-800 border-emerald-700 text-emerald-100';
        case 'error':
            return 'bg-red-800 border-red-700 text-red-100';
        case 'warning':
            return 'bg-orange-800 border-orange-700 text-orange-100';
        case 'info':
            return 'bg-blue-800 border-blue-700 text-blue-100';
        default:
            return 'bg-slate-800 border-slate-700 text-slate-100';
    }
}   
function getIconPath(toastType: string) {
    switch (toastType) {
        case 'success':
            return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
        case 'error':
            return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
        case 'warning':
            return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z';
        case 'info':
            return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        default:
            return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
}

function pauseTimer(toastId: string) {
  hoveredToastId = toastId;
  if (!pausedToasts.has(toastId)) {
    const toast = $toasts.find(t => t.id === toastId);
    if (toast && toast.duration > 0) {
      pausedToasts.set(toastId, { 
        pauseTime: Date.now(), 
        remainingDuration: toast.duration 
      });
      toastActions.pause(toastId);
    }
  }
}

function resumeTimer(toastId: string) {
  hoveredToastId = null;
  const pausedInfo = pausedToasts.get(toastId);
  if (pausedInfo) {
    toastActions.resume(toastId, pausedInfo.remainingDuration);
    pausedToasts.delete(toastId);
  }
}
</script>

<div class="fixed bottom-4 right-4 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
  {#each $toasts as toast (toast.id)}
    <div 
      class="pointer-events-auto border rounded-xl p-3.5 shadow-xl backdrop-blur-md {getToastsStyles(toast.type)}"
      transition:fly={{ x: 200, duration: 250, opacity: 0 }}
      role="alert"
      onmouseenter={() => pauseTimer(toast.id)}
      onmouseleave={() => resumeTimer(toast.id)}
    >
      <div class="flex items-start gap-2.5">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconPath(toast.type)}></path>
        </svg>
        
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium leading-relaxed break-words">{toast.message}</p>
        </div>
        
        <button
          class="text-current opacity-50 hover:opacity-100 p-0.5 rounded transition-opacity shrink-0"
          aria-label="Close notification"
          onclick={() => toastActions.remove(toast.id)}
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      {#if toast.isConfirm}
        <div class="flex justify-end gap-2 mt-3 pt-2.5 border-t border-white/5">
          <button
            class="px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-md transition-colors"
            onclick={toast.onCancel}
          >
            {$translate.global.cancel}
          </button>
          <button
            class="px-3 py-1 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-md transition-colors shadow-sm"
            onclick={toast.onConfirm}
          >
            {$translate.global.confirm}
          </button>
        </div>
      {/if}
    </div>
  {/each}
</div>