<script lang="ts">
import Sidebar from './components/layout/sidebar.svelte';
import MainContent from './components/layout/main_content.svelte';
import Toast from './components/toast/toast.svelte';
</script>

<div class="flex h-screen">
  <Sidebar /> 
  <MainContent/> 
  <Toast />
</div>