<script lang="ts">
import { page } from '$app/state';
let {data = null} = $props();

const errorStatus = page.status || 500;
const errorMessage = page.error?.message || 'An unknown error occurred';

const errorInfo = $derived({
    title: `Error ${errorStatus}`,
    description: 'An unexpected error occurred.',
    suggestions: [
        'Check if the database server is running and accessible',
        'Ensure that the API endpoint is correct',
        'Try refreshing the page',
    ]
});
</script>

<div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-slate-800 rounded-lg p-8">
        <div class="text-center mb-6">
            <div class="mb-4">
                <svg class="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>

            <h1 class="text-3xl font-bold text-white mb-2">
                {errorInfo.title}
            </h1>

            <p class="text-slate-300 mb-6">
                {errorInfo.description}
            </p>
        </div>

        {#if errorMessage !== 'An unknown error occurred'}
            <div class="bg-slate-700 p-4 rounded mb-6">
                <h3 class="text-sm font-semibold text-red-400 mb-2">Error Details:</h3>
                <p class="text-sm text-slate-300 font-mono break-words">{errorMessage}</p>
                
            </div>
        {/if}

        <div class="bg-slate-700 p-4 rounded mb-6">
            <h3 class="text-sm font-semibold text-blue-400 mb-3">What you can try:</h3>
            <ul class="text-sm text-slate-300 space-y-2">
                {#each errorInfo.suggestions as suggestion}
                    <li class="flex items-start">
                        <span class="text-blue-400 mr-2">•</span>
                        {suggestion}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>
