<script lang="ts">
    import Sidebar from './components/layout/sidebar.svelte';
    import MainContent from './components/layout/main_content.svelte';

    let selectedProjectId = $state<number | null>(null);

      function handleProjectSelect(projectId: number | null) {
      selectedProjectId = projectId;
    }
</script>

<div class="flex h-screen">
  <Sidebar
    bind:selectedProjectId={selectedProjectId}
    onProjectSelect={handleProjectSelect} 
  />
  <MainContent {selectedProjectId} />
</div>