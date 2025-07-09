<script lang="ts">
  import { onMount } from 'svelte';
  import ProjectModal from '../modal/project_modal.svelte';
  import { 
  projectList, 
  selectedProjectId, 
  projectActions,
  type CreateProjectData,
  type UpdateProjectData,
  type ProjectView,
  type ProjectSummary,
  toastActions
} from '$lib/features';

  let newProjectModalOpen = $state(false);
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
       const confirmed = await toastActions.confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;
      try {
          await projectActions.delete(projectId);
          if ($selectedProjectId === projectId) {
              projectActions.select(null); 
          }
          toastActions.success("Project deleted successfully");
      } catch {
          toastActions.error("Failed to delete project");
      }
  }

  onMount(() => {
    projectActions.loadAll();
  });
</script>

<div class="w-64 bg-slate-800/90 p-4 flex flex-col relative">
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
        Create New Project
      </span>
    </button>
  </div>

  <div class="border-b border-purple-500/30 mb-4"></div>

  <div class="flex-1 z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
    <h3 class="text-xs font-semibold mb-3 uppercase tracking-wider">Projects</h3>
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
          <li class="text-xs text-emerald-400 font-semibold mt-3 mb-2 px-1">Active</li>
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
                    title="Edit project"
                    aria-label="Edit project"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="text-red-300 p-2 hover:text-red-200 hover:bg-slate-600/50 transition-all duration-150"
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
          {/each}
        {/if}

        <!-- INACTIVE -->
        {#if $projectList.some(p => p.status === 'inactive')}
          <li class="text-xs text-amber-400 font-semibold mt-3 mb-2 px-1">Inactive</li>
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
                    title="Edit project"
                    aria-label="Edit project"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="text-red-300 p-2 hover:text-red-200 hover:bg-slate-600/50 transition-all duration-150"
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
          {/each}
        {/if}

        <!-- ENDED -->
        {#if $projectList.some(p => p.status === 'ended')}
          <li class="text-xs text-slate-400 font-semibold mt-3 mb-2 px-1">Ended</li>
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
                    title="Edit project"
                    aria-label="Edit project"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onclick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    class="text-red-300 p-2 hover:text-red-200 hover:bg-slate-600/50 transition-all duration-150"
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
          {/each}
        {/if}
        
      </ul>
    {:else}
      <div class="text-slate-400 text-sm text-center py-8">
        <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>No projects detected</span>
      </div>
    {/if}
  </div>

  <div class="mt-4 pt-4 border-t border-purple-500/30">
    <div class="flex items-center justify-center gap-2 text-xs text-slate-400">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-medium">
        💻 Made by Mi1y
      </span>
    </div>
  </div>
</div>

<ProjectModal 
  bind:isOpen={newProjectModalOpen} 
  onProjectCreated={handleProjectCreatedOrEdited}
  onClose={closeNewProjectModal}
  projectEdit={projectToEdit}
/>