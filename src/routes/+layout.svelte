<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="h-screen w-screen bg-[#090a0f] text-zinc-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-white">
  {@render children?.()}
</div>
