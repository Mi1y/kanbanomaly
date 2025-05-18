<div class="flex flex-col gap-4 p-4">
  <div class="bg-white p-4 rounded-md shadow">
    <h3 class="text-xl font-bold mb-2">Project Management</h3>
    
    <div class="mb-6 border-b pb-4">
      <h4 class="text-lg font-semibold mb-2">Create New Project</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          bind:value={newProjectTitle}
          placeholder="Project title"
          class="p-2 border rounded w-full"
        />
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block text-sm mb-1">Start date</label>
            <input type="date" bind:value={newProjectStartDate} class="p-2 border rounded w-full" />
          </div>
          <div class="flex-1">
            <label class="block text-sm mb-1">End date</label>
            <input type="date" bind:value={newProjectEndDate} class="p-2 border rounded w-full" />
          </div>
        </div>
        <div class="md:col-span-2">
          <button
            on:click={addNewProject}
            class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>

    {#if projects.length > 0}
      <div>
        <h4 class="text-lg font-semibold mb-2">Select Project</h4>
        <div class="flex gap-2 mb-4">
          <select bind:value={selectedProjectId} class="p-2 border rounded flex-1" on:change={loadTasksForProject}>
            <option value={null}>Select a project</option>
            {#each projects as project}
              <option value={project.id}>{project.title}</option>
            {/each}
          </select>
        </div>
        
        {#if selectedProject}
          <div class="bg-gray-100 p-3 rounded mb-4">
            <h4 class="text-lg font-bold">{selectedProject.title}</h4>
            <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>Start date:</div>
              <div>{selectedProject.start_date ? formatDate(selectedProject.start_date) : 'Not set'}</div>
              <div>End date:</div>
              <div>{selectedProject.end_date ? formatDate(selectedProject.end_date) : 'Not set'}</div>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <p>No projects available. Create one above.</p>
    {/if}
  </div>

  {#if selectedProjectId}
    <div class="bg-white p-4 rounded-md shadow">
      <h3 class="text-lg font-bold mb-2">Add New Task</h3>
      <div class="flex gap-2 flex-wrap">
        <input
          bind:value={newTaskTitle}
          placeholder="Task name"
          class="flex-1 p-2 border rounded"
        />
        <select bind:value={newTaskStatus} class="p-2 border rounded">
          <option value="todo">TODO</option>
          <option value="doing">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select bind:value={newTaskLevel} class="p-2 border rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button
          on:click={addNewTask}
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </div>
  {/if}

  {#if selectedProjectId}
    <div class="flex gap-4">
      {#each Object.entries(columns) as [statusColumnKey, tasks]}
        <div
          class="flex-1 bg-gray-50 p-2 rounded-md"
          role="group"
          on:dragover|preventDefault={handleDragOver}
          on:drop={() => handleDrop(statusColumnKey)}
        >
          <h3 class="text-lg font-bold mb-2">{statusColumnKey.toUpperCase()}</h3>
          {#if loading}
            <p>⏳ Loading data...</p>
          {/if}
          {#each tasks as task (task.id)}
            <div
              class={`mb-2 p-2 rounded shadow cursor-grab hover:bg-gray-50 
              ${
                statusColumnKey === 'todo' ? 'bg-yellow-200' : 
                statusColumnKey === 'doing' ? 'bg-blue-200' : 
                'bg-green-200'
              }`}
              draggable="true"
              on:dragstart={() => handleDragStart(task, statusColumnKey)}
              role="button"
              tabindex="0"
            >
              <div class="flex justify-between items-center">
                {#if editingTaskId === task.id}
                  <div class="flex-1">
                    <input
                      bind:value={editTaskTitle}
                      class="w-full p-1 border rounded mb-1"
                      on:keydown={(e) => e.key === 'Enter' && saveTaskEdit()}
                    />
                    <select bind:value={editTaskLevel} class="w-full p-1 border rounded">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <button
                      on:click={saveTaskEdit}
                      class="text-green-600 mr-2 hover:text-green-800"
                    >
                      ✓
                    </button>
                    <button
                      on:click={cancelTaskEdit}
                      class="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                {:else}
                  <div class="flex-1">
                    <div class="font-medium">{task.title}</div>
                    <div class={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                      task.level === 'low' ? 'bg-gray-200' : 
                      task.level === 'medium' ? 'bg-blue-200' : 
                      task.level === 'high' ? 'bg-orange-200' : 
                      'bg-red-200'
                    }`}>
                      {task.level || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <button
                      on:click={() => startEditTask(task)}
                      class="text-blue-600 mr-2 hover:text-blue-800"
                    >
                      ✎
                    </button>
                    <button
                      on:click={() => deleteTask(task.id)}
                      class="text-red-600 hover:text-red-800"
                    >
                      🗑
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
          {#if tasks.length === 0 && !loading}
            <p class="text-gray-500 text-sm italic">No tasks</p>
          {/if}
        </div>
      {/each}
    </div>
    <DeadlineBar newProjectStartDate={selectedProject?.start_date} newProjectEndDate={selectedProject?.end_date}/>
  {:else}
    <div class="bg-gray-100 p-4 rounded-md text-center">
      <p>Select a project to view tasks</p>
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/database/supabase';
  import type { Task } from '$lib/interfaces/tasks';
  import type { Project } from '$lib/interfaces/projects';
  import DeadlineBar from '../deadline_bar/deadline_bar.svelte';

  let columns: Record<string, Task[]> = {
    todo: [],
    doing: [],
    done: []
  };

  let activeDraggedTask: Task | null = null;
  let sourceStatusColumn: string | null = null;
  let loading = true;
  
  let projects: Project[] = [];
  let selectedProjectId: string | null = null;
  let selectedProject: Project | null = null;
  
  let newProjectTitle = '';
  let newProjectStartDate = '';
  let newProjectEndDate = '';
  
  let newTaskTitle = '';
  let newTaskStatus = 'todo';
  let newTaskLevel = 'medium';
  
  let editingTaskId: string | null = null;
  let editTaskTitle = '';
  let editTaskLevel = '';
  
  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
  
  function formatDateForDB(dateStr: string): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString();
  }
  
  async function loadProjects() {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error("Error loading projects", error);
      return;
    }
    projects = data;
  }
  
  async function addNewProject() {
    if (!newProjectTitle.trim()) {
      alert("Project title is required");
      return;
    }
    
    loading = true;
    
    const newProject = {
      title: newProjectTitle,
      start_date: formatDateForDB(newProjectStartDate),
      end_date: formatDateForDB(newProjectEndDate)
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
      loadTasksForProject();
    }
    
    loading = false;
  }
  
  function setSelectedProject(projectId: string | null) {
    if (!projectId) {
      selectedProject = null;
      return;
    }
    
    selectedProject = projects.find(p => p.id === projectId) || null;
  }
  
  async function loadTasksForProject() {
    if (!selectedProjectId) {
      columns = { todo: [], doing: [], done: [] };
      selectedProject = null;
      return;
    }
    
    loading = true;
    setSelectedProject(selectedProjectId);
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", selectedProjectId);
    
    loading = false;
    if (error) {
      console.error("Missing data", error);
      return;
    }
    
    columns = {
      todo: data.filter(task => task.status === 'todo'),
      doing: data.filter(task => task.status === 'doing'),
      done: data.filter(task => task.status === 'done'),
    };
  }
  
  async function addNewTask() {
    if (!newTaskTitle.trim() || !selectedProjectId) return;
    
    loading = true;
    
    const newTask = {
      title: newTaskTitle,
      status: newTaskStatus,
      level: newTaskLevel,
      project_id: selectedProjectId
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();
      
    if (error) {
      console.error("Error adding task", error);
    } else {
      columns[newTaskStatus] = [...columns[newTaskStatus], data[0]];
    }
    
    newTaskTitle = '';
    loading = false;
  }
  
  function startEditTask(task: Task) {
    editingTaskId = task.id;
    editTaskTitle = task.title;
    editTaskLevel = task.level || 'medium';
  }
  
  async function saveTaskEdit() {
    if (!editingTaskId || !editTaskTitle.trim()) {
      cancelTaskEdit();
      return;
    }
    
    loading = true;
    
    const { error } = await supabase
      .from('tasks')
      .update({ 
        title: editTaskTitle,
        level: editTaskLevel
      })
      .eq('id', editingTaskId);
      
    if (error) {
      console.error("Error updating task", error);
    } else {
      Object.keys(columns).forEach(columnKey => {
        columns[columnKey] = columns[columnKey].map(task => 
          task.id === editingTaskId ? { ...task, title: editTaskTitle, level: editTaskLevel } : task
        );
      });
    }
    
    editingTaskId = null;
    editTaskTitle = '';
    editTaskLevel = '';
    loading = false;
  }
  
  function cancelTaskEdit() {
    editingTaskId = null;
    editTaskTitle = '';
    editTaskLevel = '';
  }
  
  async function deleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    loading = true;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) {
      console.error("Error deleting task", error);
    } else {
      Object.keys(columns).forEach(columnKey => {
        columns[columnKey] = columns[columnKey].filter(task => task.id !== taskId);
      });
    }
    
    loading = false;
  }
  
  async function updateTaskStatus(id: string, status: string) {
    await supabase.from('tasks').update({ status }).eq('id', id);
  }
  
  function handleDragStart(task: Task, statusColumnKey: string) {
    activeDraggedTask = task;
    sourceStatusColumn = statusColumnKey;
  }
  
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  function handleDrop(targetColId: string) {
    if (activeDraggedTask && sourceStatusColumn && sourceStatusColumn !== targetColId) {
      columns[sourceStatusColumn] = columns[sourceStatusColumn].filter(t => t.id !== activeDraggedTask!.id);
      columns[targetColId] = [...columns[targetColId], { ...activeDraggedTask!, status: targetColId }];
      updateTaskStatus(activeDraggedTask.id, targetColId);
    }
    activeDraggedTask = null;
    sourceStatusColumn = null;
  }
  onMount(() => {
    loadProjects();
  });
</script>