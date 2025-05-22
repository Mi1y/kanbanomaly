  <!-- Sidebar Menu -->
  <div class="flex h-screen">
    <div class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div class="mb-4">
        <button 
          on:click={openNewProjectModal}
          class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create a new project
        </button>
      </div>
      
      <div class="border-b border-dashed border-gray-300 mb-4"></div>
      
      <div class="flex-1 overflow-y-auto">
        <h3 class="text-sm font-semibold text-gray-500 mb-2">PROJECTS</h3>
        {#if projects.length > 0}
          <ul class="space-y-1">
            {#each projects as project}
              <li class="group relative">
                {#if editingProjectId === project.id}
                  <div class="flex items-center px-2 py-1 rounded-md bg-purple-100">
                    <input
                      bind:value={editProjectTitle}
                      class="flex-1 p-1.5 border rounded text-sm"
                      placeholder="Project name"
                      on:keydown={(e) => e.key === 'Enter' && saveProjectEdit()}
                    />
                    <button
                      on:click={saveProjectEdit}
                      class="text-green-600 p-1.5 hover:text-green-800"
                    >
                      ✓
                    </button>
                    <button
                      on:click={cancelProjectEdit}
                      class="text-red-600 p-1.5 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                {:else}
                  <div class="flex">
                    <button 
                      class="flex-1 text-left px-3 py-2 rounded-md transition-colors {selectedProjectId === project.id ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100'}"
                      on:click={() => selectProject(project.id)}
                    >
                      {project.title}
                    </button>
                    <div class="hidden group-hover:flex items-center">
                      <button
                        on:click={(e) => { e.stopPropagation(); startEditProject(project); }}
                        class="text-blue-600 p-1.5 hover:text-blue-800"
                        title="Edit project"
                      >
                        ✎
                      </button>
                      <button
                        on:click={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        class="text-red-600 p-1.5 hover:text-red-800"
                        title="Delete project"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-gray-500 text-sm italic">No projects available.</p>
        {/if}
      </div>
    </div>
    
    <!-- Main content-->
    <div class="flex-1 overflow-y-auto">
      <main class="p-6 max-w-full mx-auto space-y-6">
        {#if selectedProjectId}
          <KanbanBoard selectedProjectId={selectedProjectId} />
        {:else}
          <div class="bg-white p-8 rounded-md shadow text-center">
            <h2 class="text-2xl font-bold text-gray-700">Welcome to Project Management</h2>
            <p class="mt-2 text-gray-500">Select a project from the sidebar or create a new one to get started.</p>
          </div>
        {/if}
      </main>
    </div>
  </div>
  
  <!-- Project Modal -->
  {#if newProjectModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Create New Project</h3>
        
        <div class="space-y-4">
          <div>
            <label for="project-title" class="block text-sm font-medium text-gray-700 mb-1">Project title</label>
            <input
              id="project-title"
              bind:value={newProjectTitle}
              placeholder="Enter project title"
              class="p-2 border rounded w-full"
            />
          </div>
          
          <div>
            <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">Start date</label>
            <input 
              id="start-date"
              type="date" 
              bind:value={newProjectStartDate} 
              class="p-2 border rounded w-full" 
            />
          </div>
          
          <div>
            <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">End date</label>
            <input 
              id="end-date"
              type="date" 
              bind:value={newProjectEndDate} 
              class="p-2 border rounded w-full" 
            />
          </div>
          
          <div class="flex justify-end gap-2 pt-4">
            <button
              on:click={closeNewProjectModal}
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              on:click={addNewProject}
              class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <section class="p-4 text-center text-sm text-gray-500 bottom-0 w-full">
    💻 Made by Mi1y
  </section>
  
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
    // editProjectDateStart = project.start_date;
    // editProjectDateEnd = project.end_date;
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