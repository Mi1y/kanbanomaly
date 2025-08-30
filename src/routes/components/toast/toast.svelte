<script lang="ts">
import { toasts, toastActions, translate } from "$lib/features";
import { fly } from 'svelte/transition';

let hoveredToastId= $state<string | null>(null);
let pausedToasts = $state<Map<string, {pauseTime: number, remainingDuration: number}>>(new Map());

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
            const remainingDuration = toast.duration; 
            pausedToasts.set(toastId, { 
                pauseTime: Date.now(), 
                remainingDuration 
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

<div class="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
    {#each $toasts as toast (toast.id)}
        <div 
            class="toast-container border rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 {getToastsStyles(toast.type)}"
            class:hovered={hoveredToastId === toast.id}
            in:fly={{ x: 300, duration: 300 }}
            out:fly={{ x: 300, duration: toast.isConfirm ? 0 : 300 }}
            role="alert"
            onmouseenter={() => pauseTimer(toast.id)}
            onmouseleave={() => resumeTimer(toast.id)}
        >
            <div class="flex items-start gap-3 p-4">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconPath(toast.type)}></path>
                </svg>
                
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium break-words">{toast.message}</p>
                </div>
                
                <button
                    class="text-current opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                    aria-label="Close notification"
                    onclick={() => toastActions.remove(toast.id)}
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            {#if toast.isConfirm}
                <div class="flex justify-end gap-2 px-4 pb-4 border-t border-current/20 pt-3">
                    <button
                        class="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
                        onclick={toast.onConfirm}
                    >
                        {$translate.global.confirm}
                    </button>
                    <button
                        class="px-3 py-1.5 text-xs font-medium bg-black/20 hover:bg-black/30 rounded transition-colors"
                        onclick={toast.onCancel}
                    >
                        {$translate.global.cancel}
                    </button>
                </div>
            {/if}
            
        {#if toast.duration && toast.duration > 0 && !toast.isConfirm}
            <div class="h-1 bg-black/20 rounded-b-lg overflow-hidden">
                <div 
                    class="h-full bg-white/40 rounded-b-lg progress-bar"
                    class:paused={hoveredToastId === toast.id}
                    style="animation: shrink {toast.duration}ms linear forwards;"
                ></div>
            </div>
        {/if}
        </div>
    {/each}
</div>

<style>
.toast-container.hovered {
    transform: scale(1.02);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3);
}

.progress-bar {
    transform-origin: left;
}
</style>