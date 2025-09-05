<script lang="ts">
  import { onMount } from 'svelte';
  import ProjectModal from '../modal/project_modal.svelte';
  import SettingsModal from '../modal/settings_modal.svelte';
  import { translate, toastActions } from '$lib';
  import { 
  projectList, 
  selectedProjectId, 
  projectActions,
  type CreateProjectData,
  type UpdateProjectData,
  type ProjectView,
  type ProjectSummary,
} from '$lib/supabase';

  let showSidebar = $state(true);
  let newProjectModalOpen = $state(false);
  let settingsModalOpen = $state(false);
  let projectToEdit: ProjectView | null = $state(null);
  
  function selectProject(projectId: number) {
    projectActions.select(projectId);
  }

  async function startEditProject(project: ProjectSummary) {
    const fullProject = await projectActions.getById(project.id)
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
        const newProject = await projectActions.create(data);
        // projectActions.select(newProject.id);
    }
        projectActions.loadAll();
    closeNewProjectModal();
  }
  async function deleteProject(projectId: number) {
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
<div class="{showSidebar ? 'w-64' : 'w-10'} p-4 bg-gray-800 flex flex-col relative overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out">
<button
  class="absolute right-1 p-2 rounded-full bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-200 z-20"
  onclick={toggleSidebar}
  aria-label={showSidebar ? $translate.sidebar.collapse : $translate.sidebar.expand}>
  {#if showSidebar}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15L18.75 12l-7.5 7.5" />
    </svg>
  {/if}
</button>

{#if showSidebar}
  <div class="mb-6 text-center">
    <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2 tracking-wide">
      Kanbanomaly
    </h1>
    <div class="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
  </div>
  <div class="mb-4">
    <button 
      onclick={openNewProjectModal}
      class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors duration-200 font-medium"
    >
      <span class="flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        {$translate.sidebar.createProject}
      </span>
    </button>
  </div>

  <div class="border-b border-purple-500/30 mb-4"></div>

  <div class="flex-1 z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
    <h3 class="text-xs font-semibold mb-3 uppercase tracking-wider">{$translate.sidebar.projectsList}</h3>
    {#if $projectList.length > 0}
      <ul class="space-y-1">


        <!-- SIMPLE -->
        <!-- {#each $projectList as project}
          <li class="group relative">
            <div class="flex rounded-lg">
              
              <button 
                class="flex-1 text-left px-1 py-3 transition-all duration-150 {$selectedProjectId === project.id ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white font-medium' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}"
                onclick={() => selectProject(project.id)}
                type="button"
              >
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full {$selectedProjectId === project.id ? 'bg-white' : 'bg-purple-400'} opacity-60"></div>
                    <span style="max-width: 120px;">
                      {project.title}
                    </span>
                </div>
              </button>
              
              <div class="hidden group-hover:flex items-center bg-slate-700/60 transition-opacity duration-150">
                <button
                  onclick={(e) => { 
                    e.stopPropagation(); 
                    startEditProject(project);
                  }}
                  class="text-cyan-400 p-2 hover:text-cyan-300 transition-colors"
                  title="Edit project"
                  aria-label="Edit project"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                  class="text-red-400 p-2 hover:text-red-300 transition-colors"
                  title="Delete project"
                  aria-label="Delete project"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </li>
        {/each} -->


        
        <!-- ADVANCED -->
        <!-- ACTIVE -->
        {#if $projectList.some(p => p.status === 'active')}
          <li class="text-xs text-emerald-400 font-semibold mt-3 mb-2 px-1">{$translate.projects.statusLabels.active}</li>
          {#each $projectList.filter(p => p.status === 'active') as project (project.id)}
            <li class="group relative custom scrollbar">
              <div class="flex rounded-lg overflow-hidden">
                <button 
                  class="flex-1 text-left px-1 py-2 transition-all duration-150 {$selectedProjectId === project.id ? 'bg-gradient-to-r from-emerald-600/70 to-cyan-600/70 text-white font-medium shadow-lg' : 'text-slate-200 hover:bg-slate-700/80 hover:text-white'}"
                  onclick={() => selectProject(project.id)}
                  type="button"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full {$selectedProjectId === project.id ? 'bg-white shadow-sm' : 'bg-emerald-400'} opacity-80"></div>
                    <span style="max-width: 120px;">
                      {project.title}
                    </span>
                  </div>
                </button>
                <div class="hidden group-hover:flex items-center bg-slate-700/80 transition-opacity duration-150">
                  <button
                    onclick={(e) => { 
                      e.stopPropagation(); 
                      startEditProject(project);
                    }}
                    class="text-cyan-300 p-2 hover:text-cyan-200 hover:bg-slate-600/50 transition-all duration-150"
                    title={$translate.projects.edit}
                    aria-label={$translate.projects.edit}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="text-red-300 p-2 hover:text-red-200 hover:bg-slate-600/50 transition-all duration-150"
                    title={$translate.projects.delete}
                    aria-label={$translate.projects.delete}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          {/each}
        {/if}

        <!-- INACTIVE -->
        {#if $projectList.some(p => p.status === 'inactive')}
          <li class="text-xs text-amber-400 font-semibold mt-3 mb-2 px-1">{$translate.projects.statusLabels.inactive}</li>
          {#each $projectList.filter(p => p.status === 'inactive') as project (project.id)}
            <li class="group relative custom scrollbar">
              <div class="flex rounded-lg overflow-hidden">
                <button 
                  class="flex-1 text-left px-1 py-2 transition-all duration-150 {$selectedProjectId === project.id ? 'bg-gradient-to-r from-amber-600/70 to-orange-600/70 text-white font-medium shadow-lg' : 'text-slate-300 hover:bg-slate-700/80 hover:text-slate-100'}"
                  onclick={() => selectProject(project.id)}
                  type="button"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full {$selectedProjectId === project.id ? 'bg-white shadow-sm' : 'bg-amber-400'} opacity-80"></div>
                    <span style="max-width: 120px;">
                      {project.title}
                    </span>
                  </div>
                </button>
                <div class="hidden group-hover:flex items-center bg-slate-700/80 transition-opacity duration-150">
                  <button
                    onclick={(e) => { 
                      e.stopPropagation(); 
                      startEditProject(project);
                    }}
                    class="text-cyan-300 p-2 hover:text-cyan-200 hover:bg-slate-600/50 transition-all duration-150"
                    title={$translate.projects.edit}
                    aria-label={$translate.projects.edit}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="text-red-300 p-2 hover:text-red-200 hover:bg-slate-600/50 transition-all duration-150"
                    title={$translate.projects.delete}
                    aria-label={$translate.projects.delete}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          {/each}
        {/if}

        <!-- ENDED -->
        {#if $projectList.some(p => p.status === 'ended')}
          <li class="text-xs text-slate-400 font-semibold mt-3 mb-2 px-1">{$translate.projects.statusLabels.ended}</li>
          {#each $projectList.filter(p => p.status === 'ended') as project (project.id)}
            <li class="group relative custom scrollbar">
              <div class="flex rounded-lg overflow-hidden">
                <button 
                  class="flex-1 text-left px-1 py-2 transition-all duration-150 {$selectedProjectId === project.id ? 'bg-gradient-to-r from-slate-600/70 to-slate-500/70 text-white font-medium shadow-lg' : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'}"
                  onclick={() => selectProject(project.id)}
                  type="button"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full {$selectedProjectId === project.id ? 'bg-white shadow-sm' : 'bg-slate-500'} opacity-70"></div>
                    <span style="max-width: 120px;">
                      {project.title}
                    </span>
                  </div>
                </button>
                <div class="hidden group-hover:flex items-center bg-slate-700/80 transition-opacity duration-150">
                  <button
                    onclick={(e) => { 
                      e.stopPropagation(); 
                      startEditProject(project);
                    }}
                    class="text-slate-300 p-2 hover:text-slate-200 hover:bg-slate-600/50 transition-all duration-150"
                    title={$translate.projects.edit}
                    aria-label={$translate.projects.edit}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="text-red-300 p-2 hover:text-red-200 hover:bg-slate-600/50 transition-all duration-150"
                    title={$translate.projects.delete}
                    aria-label={$translate.projects.delete}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          {/each}
        {/if}
        
      </ul>
    {:else}
      <div class="text-slate-400 text-sm text-center py-8">
        <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>{$translate.sidebar.noProjects}</span>
      </div>
    {/if}
  </div>
  <div class="mt-4 pt-4 border-t border-purple-500/30">
    <div class="flex flex-row items-center gap-2 text-xs text-slate-400">
      <button
        onclick={openSettingsModal}
        class="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
        aria-label={$translate.sidebar.openSettings}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
          <!-- <label for="settings-status" class="text-sm font-medium text-slate-300">Settings</label> -->
      </button>

      <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">
        <p>💻 Made by Mi1y</p>
      </span>
    </div>
  </div>
  {/if}
</div>

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
