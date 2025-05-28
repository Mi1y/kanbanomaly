<!-- Sidebar Menu -->
<div class="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
  <!-- Background Particles -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-10 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
    <div class="absolute bottom-20 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30"></div>
  </div>

  <div class="w-64 bg-slate-800/90 backdrop-blur-sm border-r border-purple-500/30 p-4 flex flex-col relative z-10">
    <!-- Header -->
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2 tracking-wide hover:animate-glitch-subtle">
        Kanbanomaly
      </h1>
      <div class="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </div>
    
    <div class="mb-4">
      <button 
        on:click={openNewProjectModal}
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
    
    <div class="flex-1 overflow-y-auto">
      <h3 class="text-xs font-semibold text-purple-300 mb-3 uppercase tracking-wider">Projects</h3>
      {#if projects.length > 0}
        <ul class="space-y-2">
          {#each projects as project}
            <li class="group relative">
              {#if editingProjectId === project.id}
                <div class="flex items-center px-3 py-2 rounded-lg bg-slate-700/50 border border-purple-500/30">
                  <input
                    bind:value={editProjectTitle}
                    class="flex-1 p-2 bg-slate-600 border border-purple-400/30 rounded text-sm text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none transition-colors"
                    placeholder="Project name"
                    on:keydown={(e) => e.key === 'Enter' && saveProjectEdit()}
                  />
                  <button
                    on:click={saveProjectEdit}
                    class="text-emerald-400 p-1.5 hover:text-emerald-300 transition-colors ml-2"
                  >
                    ✓
                  </button>
                  <button
                    on:click={cancelProjectEdit}
                    class="text-red-400 p-1.5 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              {:else}
                <div class="flex rounded-lg overflow-hidden">
                  <button 
                    class="flex-1 text-left px-3 py-3 transition-all duration-150 {selectedProjectId === project.id ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white font-medium' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}"
                    on:click={() => selectProject(project.id)}
                  >
                    <div class="flex items-center gap-2">
                      <!-- Anomaly indicator - for active projects -->
                      <div class="w-2 h-2 rounded-full {selectedProjectId === project.id ? 'bg-white animate-pulse' : 'bg-purple-400'} opacity-60"></div>
                      {project.title}
                    </div>
                  </button>
                  <div class="hidden group-hover:flex items-center bg-slate-700/80 transition-opacity duration-150">
                    <button
                      on:click={(e) => { e.stopPropagation(); startEditProject(project); }}
                      class="text-cyan-400 p-2 hover:text-cyan-300 transition-colors"
                      title="Edit project"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      on:click={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                      class="text-red-400 p-2 hover:text-red-300 transition-colors"
                      title="Delete project"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <div class="text-slate-400 text-sm italic text-center py-8">
          <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="animate-pulse">No projects detected</span>
        </div>
      {/if}
    </div>
    
    <!-- Footer -->
    <div class="mt-4 pt-4 border-t border-purple-500/30">
      <div class="flex items-center justify-center gap-2 text-xs text-slate-400">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-medium hover:animate-glitch-subtle">
          💻 Made by Mi1y
        </span>
      </div>
    </div>
  </div>
  
  <!-- Main content -->
  <div class="flex-1 overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
    <main class="p-6 max-w-full mx-auto space-y-6 relative z-10">
      {#if selectedProjectId}
        <KanbanBoard selectedProjectId={selectedProjectId} />
      {:else}
        <div class="bg-slate-800/80 backdrop-blur-sm p-12 rounded-xl shadow-2xl text-center border border-purple-500/20 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 rounded-xl"></div>
          
          <div class="relative z-10">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            
            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Welcome to Kanbanomaly
            </h2>
            <p class="text-slate-400 text-lg mb-6 max-w-md mx-auto">
              Detect and manage project anomalies with advanced kanban workflows
            </p>
            
            <div class="flex items-center justify-center gap-4 text-sm text-slate-500">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Ready to initialize</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>

<!-- Project Modal -->
{#if newProjectModalOpen}
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div class="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md border border-purple-500/30 relative overflow-hidden animate-scale-in">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Initialize New Project</h3>
        </div>
        
        <div class="space-y-5">
          <div>
            <label for="project-title" class="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
            <input
              id="project-title"
              bind:value={newProjectTitle}
              placeholder="Enter project designation"
              class="p-3 bg-slate-700 border border-purple-400/30 rounded-lg w-full text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="start-date" class="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
              <input 
                id="start-date"
                type="date" 
                bind:value={newProjectStartDate} 
                class="p-3 bg-slate-700 border border-purple-400/30 rounded-lg w-full text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200" 
              />
            </div>
            
            <div>
              <label for="end-date" class="block text-sm font-medium text-slate-300 mb-2">End Date</label>
              <input 
                id="end-date"
                type="date" 
                bind:value={newProjectEndDate} 
                class="p-3 bg-slate-700 border border-purple-400/30 rounded-lg w-full text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200" 
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-6">
            <button
              on:click={closeNewProjectModal}
              class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              on:click={addNewProject}
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200 font-medium"
            >
              Initialize Project
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/database/supabase';
  import KanbanBoard from './kanban_board/kanban_board.svelte';
  import type { Project } from '$lib/interfaces/projects';
  
  let projects: Project[] = [];
  let selectedProjectId: string | null = null;
  
  let newProjectModalOpen = false;
  let newProjectTitle = '';
  let newProjectStartDate = '';
  let newProjectEndDate = '';
  
  let editingProjectId: string | null = null;
  let editProjectTitle = '';
  
  async function loadProjects() {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error("Error loading projects", error);
      return;
    }
    projects = data;
  }
  
  function selectProject(projectId: string) {
    selectedProjectId = projectId;
  }
  
  async function addNewProject() {
    if (!newProjectTitle.trim()) {
      alert("Project title is required");
      return;
    }
    
    const newProject = {
      title: newProjectTitle,
      start_date: newProjectStartDate ? new Date(newProjectStartDate).toISOString() : null,
      end_date: newProjectEndDate ? new Date(newProjectEndDate).toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();
      
    if (error) {
      console.error("Error creating project", error);
      alert("Failed to create project");
    } else {
      projects = [...projects, data[0]];
      
      newProjectTitle = '';
      newProjectStartDate = '';
      newProjectEndDate = '';
      
      selectedProjectId = data[0].id;
      newProjectModalOpen = false;
    }
  }
  
  function startEditProject(project: Project) {
    editingProjectId = project.id;
    editProjectTitle = project.title;
  }
  
  async function saveProjectEdit() {
    if (!editingProjectId || !editProjectTitle.trim()) {
      cancelProjectEdit();
      return;
    }
    
    const { error } = await supabase
      .from('projects')
      .update({ title: editProjectTitle })
      .eq('id', editingProjectId);
      
    if (error) {
      console.error("Error updating project", error);
      alert("Failed to update project");
    } else {
      projects = projects.map(project => 
        project.id === editingProjectId ? { ...project, title: editProjectTitle } : project
      );
    }
    
    editingProjectId = null;
    editProjectTitle = '';
  }
  
  function cancelProjectEdit() {
    editingProjectId = null;
    editProjectTitle = '';
  }
  
  async function deleteProject(projectId: string) {
    if (!confirm('Are you sure you want to delete this project? All tasks will also be deleted.')) return;
    
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId);
      
    if (tasksError) {
      console.error("Error deleting project tasks", tasksError);
      alert("Failed to delete project tasks");
      return;
    }
    
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (projectError) {
      console.error("Error deleting project", projectError);
      alert("Failed to delete project");
      return;
    }
    
    projects = projects.filter(project => project.id !== projectId);
    
    if (selectedProjectId === projectId) {
      selectedProjectId = null;
    }
  }
  
  function openNewProjectModal() {
    newProjectModalOpen = true;
  }
  
  function closeNewProjectModal() {
    newProjectModalOpen = false;
  }
  
  onMount(() => {
    loadProjects();
  });
</script>

<style>
  :global(.animate-glitch-subtle) {
    animation: glitch-subtle 3s infinite;
  }
  
  @keyframes glitch-subtle {
    0%, 98% { 
      transform: translate(0); 
      filter: hue-rotate(0deg);
    }
    1% { 
      transform: translate(-1px, 0); 
      filter: hue-rotate(90deg);
    }
    2% { 
      transform: translate(1px, 0); 
      filter: hue-rotate(0deg);
    }
  }
  
  /* modal */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from { 
      opacity: 0; 
      transform: scale(0.9) translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  :global(.animate-fade-in) {
    animation: fade-in 0.2s ease-out;
  }
  
  :global(.animate-scale-in) {
    animation: scale-in 0.2s ease-out;
  }
</style>