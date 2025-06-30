<script lang="ts">
import { projectStore, selectedProject } from '$lib/stores/projectStore';
import { tasks, tasksLoading, taskStore } from '$lib/stores/taskStore';
import type { Task } from '$lib/interfaces/tasks';
import DeadlineBar from './deadline_bar.svelte';

// export let selectedProjectId: number | null = null;

let { selectedProjectId = $bindable() } : { selectedProjectId: number | null } = $props();

let newTaskTitle = $state('');
let newTaskStatus = $state('todo');
let newTaskLevel = $state('medium');

let editingTaskId = $state<number | null>(null);
let editTaskTitle = $state('');
let editTaskLevel = $state(''); 

// Drag & drop
let draggedTask = $state<Task | null>(null);
let dragSourceColumn = $state<string | null>(null);
let dragOverColumn = $state<string | null>(null);

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

async function addNewTask() {
    if (!newTaskTitle.trim() || !selectedProjectId) return;
    
    try {
    await taskStore.createTask({
        title: newTaskTitle,
        status: newTaskStatus,
        level: newTaskLevel,
        project_id: selectedProjectId
    });
    
    newTaskTitle = '';
    } catch (error) {
    alert("Failed to add task");
    }
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
    
    try {
    await taskStore.updateTask(editingTaskId, {
        title: editTaskTitle,
        level: editTaskLevel
    });
    
    editingTaskId = null;
    editTaskTitle = '';
    editTaskLevel = '';
    } catch (error) {
    alert("Failed to update task");
    }
}

function cancelTaskEdit() {
    editingTaskId = null;
    editTaskTitle = '';
    editTaskLevel = '';
}

async function deleteTask(taskId: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
    await taskStore.deleteTask(taskId);
    } catch (error) {
    alert("Failed to delete task");
    }
}

function handleDragStart(task: Task, statusColumnKey: string) {
    draggedTask = task;
    dragSourceColumn = statusColumnKey;
}

function handleDragOver(event: DragEvent) {
    event.preventDefault();
}

async function handleDrop(targetColId: string) {
    if (draggedTask && dragSourceColumn && dragSourceColumn !== targetColId) {
      try {
          await taskStore.moveTask(draggedTask.id, dragSourceColumn, targetColId);
      } catch (error) {
          alert("Failed to move task");
      }
    }
    draggedTask = null;
    dragSourceColumn = null;
}

$effect(() => { 
  if (selectedProjectId) {
    projectStore.selectProject(selectedProjectId);
    taskStore.loadTasksForProject(selectedProjectId);
  }
});
</script>


{#if $selectedProject}
    <div class="bg-slate-800 p-6 rounded-xl mb-6 border border-purple-500/20 overflow-hidden">
    <div class="bg-gradient-to-br from-purple-600/10"></div>      
      <div class="relative">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {$selectedProject.title}
          </h2>
          <div class="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
            <!-- TODO CHECK IF PROJECT ACTIVE/DONE/UNDONE -->
            PROJECT ACTIVE
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6 text-sm">
          <div class="flex items-center gap-3">
            <div class="text-slate-400 font-medium">Start date:</div>
            <div class="text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg">
              {formatDate($selectedProject.start_date) || 'Not configured'}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-slate-400 font-medium">End date:</div>
            <div class="text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg">
              {formatDate($selectedProject.end_date) || 'Not configured'}
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="bg-slate-800/60 p-6 rounded-xl mb-6 border border-purple-500/20 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-purple-600/5"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white">Deploy New Task</h3>
        </div>
        
        <div class="flex gap-3 flex-wrap">
          <input
            bind:value={newTaskTitle}
            placeholder="Enter task name"
            class="flex-1 min-w-64 p-3 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
          />
          <!-- TODO - IMPROVE CSS UI FOR OPTION -->
          <select bind:value={newTaskStatus} class="p-3 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all">
            <option value="todo">TODO</option>
            <option value="doing">IN PROGRESS</option>
            <option value="done">COMPLETED</option>
          </select>
          
          <select bind:value={newTaskLevel} class="appearance-none p-3 min-w-40 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          
          <button
            onclick={addNewTask}
            class="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            Deploy Task
          </button>
        </div>
      </div>
    </div>
  
    <!-- Kanban Columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each Object.entries($tasks) as [statusColumnKey, columnTasks]}
    <div class={`bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden relative group transition-all duration-200
        ${dragOverColumn === statusColumnKey ? 'ring-4 ring-cyan-400/40 border-cyan-400/60 shadow-xl scale-[1.02]' : ''}
      `}
      role="group"
      ondragover={(e) => { handleDragOver(e); dragOverColumn = statusColumnKey; }}
      ondragleave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          dragOverColumn = null;
        }
      }}
      ondrop={() => { handleDrop(statusColumnKey); dragOverColumn = null; }}
      >
          <div class="p-4 border-b border-slate-700/50 bg-gradient-to-r {
            statusColumnKey === 'todo' ? 'from-yellow-600/20 to-orange-600/20' : 
            statusColumnKey === 'doing' ? 'from-blue-600/20 to-cyan-600/20' : 
            'from-emerald-600/20 to-green-600/20'
          }">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <div class="w-3 h-3 rounded-full {
                  statusColumnKey === 'todo' ? 'bg-yellow-400' : 
                  statusColumnKey === 'doing' ? 'bg-blue-400' : 
                  'bg-emerald-400'
                }"></div>
                {statusColumnKey === 'todo' ? 'TODO' : statusColumnKey === 'doing' ? 'IN PROGRESS' : 'COMPLETED'}
              </h3>
              <div class="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                {columnTasks.length}
              </div>
            </div>
          </div>
  
          <div class="p-4 min-h-96 space-y-3">
            {#if $tasksLoading}
              <div class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                <span class="ml-2 text-slate-400">Loading tasks...</span>
              </div>
            {/if}
            
            {#each columnTasks as task (task.id)}
              <div
                class={`p-4 rounded-lg shadow-lg cursor-grab hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-600/30 ${
                  statusColumnKey === 'todo' ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20' : 
                  statusColumnKey === 'doing' ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20' : 
                  'bg-gradient-to-br from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20'
                } group/task`}
                draggable="true"
                ondragstart={() => handleDragStart(task, statusColumnKey)}
                role="button"
                tabindex="0"
              >
                <div class="flex justify-between items-start">
                  {#if editingTaskId === task.id}
                    <!-- Edit Mode -->
                    <div class="flex-1 space-y-3">
                      <input
                        bind:value={editTaskTitle}
                        class="w-full p-2 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                        onkeydown={(e) => e.key === 'Enter' && saveTaskEdit()}
                      />
                      <select bind:value={editTaskLevel} class="w-full p-2 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div class="flex gap-1 ml-3">
                      <button
                        onclick={saveTaskEdit}
                        class="text-emerald-400 p-2 hover:text-emerald-300 hover:bg-emerald-400/10 rounded transition-all"
                        title="Save changes"
                        aria-label="Save task changes"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                      <button
                        onclick={cancelTaskEdit}
                        class="text-red-400 p-2 hover:text-red-300 hover:bg-red-400/10 rounded transition-all"
                        title="Cancel"
                        aria-label="Cancel task edit"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  {:else}
                    <div class="flex-1">
                      <div class="font-semibold mb-2">
                        {task.title}
                      </div>
                      <div class={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                        task.level === 'low' ? 'bg-slate-600/50 text-slate-300' : 
                        task.level === 'medium' ? 'bg-blue-500/30 text-blue-200' : 
                        task.level === 'high' ? 'bg-orange-500/30 text-orange-200' : 
                        'bg-red-500/30 text-red-200'
                      }`}>
                        <div class="w-1.5 h-1.5 rounded-full {
                          task.level === 'low' ? 'bg-slate-400' : 
                          task.level === 'medium' ? 'bg-blue-400' : 
                          task.level === 'high' ? 'bg-orange-400' : 
                          'bg-red-400'
                        }"></div>
                        {task.level === 'critical' ? 'CRITICAL' : task.level?.toUpperCase() || 'UNDEFINED'}
                      </div>
                    </div>
                    
                    <div class="flex gap-1 ml-3 opacity-0 group-hover/task:opacity-100 transition-opacity">
                      <button
                        onclick={() => startEditTask(task)}
                        class="text-cyan-400 p-2 hover:text-cyan-300 hover:bg-cyan-400/10 rounded transition-all"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onclick={() => deleteTask(task.id)}
                        class="text-red-400 p-2 hover:text-red-300 hover:bg-red-400/10 rounded transition-all"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
            
            {#if columnTasks.length === 0 && !$tasksLoading}
              <div class="text-center py-12">
                <div class="w-12 h-12 mx-auto mb-3 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p class="text-slate-500 text-sm italic">No anomalies detected</p>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    
  <div class="mt-8">
    <DeadlineBar 
      newProjectStartDate={$selectedProject?.start_date} 
      newProjectEndDate={$selectedProject?.end_date}
    />
  </div>
  
  {:else if selectedProjectId}
  <div class="flex justify-center items-center h-64">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
      <p class="text-slate-400">Preparing project board...</p>
    </div>
  </div>
{/if}