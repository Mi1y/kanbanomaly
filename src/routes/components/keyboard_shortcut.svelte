<script lang="ts">
  import { onMount } from "svelte";

  let { onEscape, allowZoom = false }: { onEscape?: () => void; allowZoom?: boolean } = $props();

  const DEFAULT_FONT_SIZE = 18;
  let baseFontSize = DEFAULT_FONT_SIZE;

  function updateFontSize(size: number, save = true) {
    baseFontSize = size;
    document.documentElement.style.fontSize = `${size}px`;
    if (save && typeof localStorage !== 'undefined') {
      localStorage.setItem('userFontSize', size.toString());
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    if (allowZoom && (e.ctrlKey || e.metaKey)) {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        const next = Math.min(26, baseFontSize + 1);
        updateFontSize(next);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        const next = Math.max(12, baseFontSize - 1);
        updateFontSize(next);
      } else if (e.key === '0') {
        e.preventDefault();
        updateFontSize(DEFAULT_FONT_SIZE);
      }
    }
  }

  onMount(() => {
    if (allowZoom && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('userFontSize');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 12 && parsed <= 26) {
          updateFontSize(parsed, false);
        } else {
          updateFontSize(DEFAULT_FONT_SIZE, false);
        }
      } else {
        updateFontSize(DEFAULT_FONT_SIZE, false);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>
