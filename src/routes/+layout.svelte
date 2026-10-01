<script lang="ts">
  import "../app.css";
  import KeyboardShortcut from "./components/keyboard_shortcut.svelte";
  let { children } = $props();
</script>

<KeyboardShortcut allowZoom={true} />
<div class="h-screen w-screen bg-[#090a0f] text-zinc-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-white overflow-hidden">
  {@render children?.()}
</div>
