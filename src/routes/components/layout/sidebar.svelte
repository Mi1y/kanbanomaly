<script lang="ts">
  import { onMount } from 'svelte';
  import ProjectModal from '../modal/project_modal.svelte';
  import SettingsModal from '../modal/settings_modal.svelte';
  import { 
    translate, 
    toastActions,
    projectList, 
    selectedProjectId, 
    projectActions,
    exportImportService,
    dataSource,
    type UnifiedCreateProjectData as CreateProjectData,
    type UnifiedUpdateProjectData as UpdateProjectData,
    type UnifiedProjectView as ProjectView,
    type UnifiedProjectSummary as ProjectSummary,
  } from '$lib';

  let showSidebar = $state(true);
  let newProjectModalOpen = $state(false);
  let settingsModalOpen = $state(false);
  let projectToEdit: ProjectView | null = $state(null);
  let fileInputElement: HTMLInputElement | undefined = $state();
  
  function triggerImport() {
    fileInputElement?.click();
  }

  async function handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const count = await exportImportService.importFromJson(text);
      toastActions.success(`${$translate.toasts.other.importSuccess}: ${count}`);
    } catch {
      toastActions.error($translate.toasts.other.importFailed);
    } finally {
      input.value = '';
    }
  }

  async function exportProject(projectId: string) {
    try {
      await exportImportService.exportSingleProject(projectId);
      toastActions.success($translate.toasts.other.exportSuccess);
    } catch {
      toastActions.error($translate.toasts.error.unexpected);
    }
  }
  
  function selectProject(projectId: string) {
    projectActions.select(projectId);
  }

  async function startEditProject(project: ProjectSummary) {
    const fullProject = await projectActions.getById(project.id);
    projectToEdit = fullProject;
    newProjectModalOpen = true;
  }

  function openNewProjectModal() {
    projectToEdit = null;
    newProjectModalOpen = true;
  }

  function closeNewProjectModal() {
    newProjectModalOpen = false;
    projectToEdit = null;
  }

  function openSettingsModal() {
    settingsModalOpen = true;
  }
  function closeSettingsModal() {
    settingsModalOpen = false;
  }

  async function handleProjectCreatedOrEdited(project: any) {
    if (projectToEdit) {
      const updates: UpdateProjectData = {
        title: project.title,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date
      };
      await projectActions.update(projectToEdit.id, updates);
    } else {
      const data: CreateProjectData = {
        title: project.title,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date
      };
      await projectActions.create(data);
    }
    projectActions.loadAll();
    closeNewProjectModal();
  }

  async function deleteProject(projectId: string) {
    const confirmed = await toastActions.confirm($translate.toasts.confirm.deleteProject);
    if (!confirmed) return;
    try {
      await projectActions.delete(projectId);
      if ($selectedProjectId === projectId) {
        projectActions.select(null); 
      }
      toastActions.success($translate.toasts.success.projectDeleted);
    } catch {
      toastActions.error($translate.toasts.error.projectDeleteFailed);
    }
  }

  function toggleSidebar() {
    showSidebar = !showSidebar;
  }

  onMount(() => {
    projectActions.loadAll();
  });
</script>

<aside class="{showSidebar ? 'w-72' : 'w-16'} h-full bg-[#0d0f17] border-r border-white/5 flex flex-col relative transition-all duration-200 select-none z-20">
  <div class="h-14 px-3 flex items-center justify-between border-b border-white/5">
    {#if showSidebar}
      <div class="flex items-center gap-2.5 overflow-hidden pl-1">
        <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
          <img src="/favicon.svg" alt="Kanbanomaly" class="w-7 h-7 object-contain" />
        </div>
        <span class="font-semibold text-sm tracking-tight text-zinc-100 truncate">Kanbanomaly</span>
      </div>
    {/if}

    <button
      class="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors {showSidebar ? '' : 'mx-auto'}"
      onclick={toggleSidebar}
      aria-label={showSidebar ? $translate.sidebar.collapse : $translate.sidebar.expand}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        {#if showSidebar}
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        {/if}
      </svg>
    </button>
  </div>

  {#if showSidebar}
    <div class="p-3 space-y-2">
      <button 
        onclick={openNewProjectModal}
        class="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-all shadow-sm shadow-indigo-600/20"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>{$translate.sidebar.createProject}</span>
      </button>

      <button
        onclick={triggerImport}
        class="w-full flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-zinc-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-md transition-all"
        title={$translate.sidebar.importProject}
      >
        <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
        <span>{$translate.sidebar.importProject}</span>
      </button>
      <input
        type="file"
        accept=".json"
        class="hidden"
        bind:this={fileInputElement}
        onchange={handleFileSelected}
      />
    </div>

    <div class="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar">
      <div class="flex items-center justify-between text-[11px] font-medium text-zinc-500 uppercase tracking-wider px-2 mb-2">
        <span>{$translate.sidebar.projectsList}</span>
        <span class="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400 font-mono">{$projectList.length}</span>
      </div>

      {#if $projectList.length > 0}
        <ul class="space-y-0.5">
          {#each $projectList as project (project.id)}
            {@const isSelected = $selectedProjectId === project.id}
            <li class="group relative">
              <div class="flex items-center rounded-md transition-colors {isSelected ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}">
                <button 
                  class="flex-1 min-w-0 text-left px-2.5 py-2 text-xs flex items-center gap-2"
                  onclick={() => selectProject(project.id)}
                  type="button"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0 {project.status === 'active' ? 'bg-emerald-400' : project.status === 'ended' ? 'bg-zinc-500' : 'bg-amber-400'}"></span>
                  <span class="truncate">{project.title}</span>
                </button>
                
                <div class="hidden group-hover:flex items-center pr-1 shrink-0 gap-0.5">
                  <button
                    onclick={(e) => { e.stopPropagation(); exportProject(project.id); }}
                    class="p-1 rounded text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title={$translate.sidebar.exportProject}
                    aria-label={$translate.sidebar.exportProject}
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); startEditProject(project); }}
                    class="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors"
                    title={$translate.projects.edit}
                    aria-label={$translate.projects.edit}
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title={$translate.projects.delete}
                    aria-label={$translate.projects.delete}
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="text-zinc-600 text-xs text-center py-8">
          <span>{$translate.sidebar.noProjects}</span>
        </div>
      {/if}
    </div>

    <div class="p-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
      <button
        onclick={openSettingsModal}
        class="flex items-center gap-2 p-1.5 rounded-md hover:text-zinc-200 hover:bg-white/5 transition-colors"
        aria-label={$translate.sidebar.openSettings}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span>{$translate.ui.settings}</span>
      </button>

      <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 font-mono">
        {$dataSource === 'local' ? 'Local' : 'Cloud'}
      </span>
    </div>
  {/if}
</aside>

<ProjectModal 
  bind:isOpen={newProjectModalOpen} 
  onProjectCreated={handleProjectCreatedOrEdited}
  onClose={closeNewProjectModal}
  projectEdit={projectToEdit}
/>
<SettingsModal
  bind:isOpen={settingsModalOpen}
  onClose={closeSettingsModal}
/>
