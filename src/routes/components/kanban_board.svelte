<script lang="ts">
import { 
  toastActions, 
  translate,
  selectedProject, 
  selectedProjectId,
  taskColumns, 
  tasksLoading, 
  taskActions,
  projectActions,
} from '$lib';
import type { 
  UnifiedCreateTaskData as CreateTaskData,
  UnifiedTaskView as TaskView,
} from '$lib';
import type { TaskStatus, TaskLevel } from '$lib/local/tasks/interfaces';
import DeadlineBar from './deadline_bar.svelte';

let newTaskTitle = $state('');
let newTaskStatus = $state<TaskStatus>('todo');
let newTaskLevel = $state<TaskLevel>('medium');

let editingTaskId = $state<string | null>(null);
let editTaskTitle = $state('');
let editTaskLevel = $state<TaskLevel>('medium'); 

let draggedTaskId = $state<string | null>(null);
let dragSourceColumn = $state<TaskStatus | null>(null);  
let dragOverColumn = $state<TaskStatus | null>(null); 

function formatDate(dateVal: Date | string | null): string {
  if (!dateVal) return '';
  const date = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
}

async function addNewTask() {
  if (!newTaskTitle.trim() || !$selectedProjectId) {
    toastActions.warning($translate.toasts.validation.enterTaskName);
    return;
  }
  
  try {
    const data: CreateTaskData = {
      title: newTaskTitle.trim(),
      status: newTaskStatus,
      level: newTaskLevel,
      project_id: $selectedProjectId
    };
    await taskActions.create(data);
    projectActions.loadAll();
    toastActions.success($translate.toasts.other.taskPrefix + ` "${newTaskTitle}" ${$translate.toasts.other.taskSuffixSuccess}`);
    newTaskTitle = '';
  } catch {
    toastActions.error($translate.toasts.error.taskCreateFailed);
  }
}

function startEditTask(task: TaskView) {
  editingTaskId = task.id;
  editTaskTitle = task.title;
  editTaskLevel = task.level;
}

async function saveTaskEdit() {
  if (!editingTaskId || !editTaskTitle.trim()) {
    cancelTaskEdit();
    return;
  }
  
  try {
    await taskActions.update(editingTaskId, {
      title: editTaskTitle.trim(),
      level: editTaskLevel
    });
    editingTaskId = null;
    editTaskTitle = '';
    editTaskLevel = 'medium';
    projectActions.loadAll();
    toastActions.success($translate.toasts.success.taskUpdated);
  } catch {
    toastActions.error($translate.toasts.error.taskUpdateFailed);
  }
}

function cancelTaskEdit() {
  editingTaskId = null;
  editTaskTitle = '';
  editTaskLevel = 'medium';
}

async function deleteTask(taskId: string) {
  const confirmed = await toastActions.confirm($translate.toasts.confirm.deleteTask);
  if (!confirmed) return;
  try {
    await taskActions.delete(taskId);
    projectActions.loadAll();  
    toastActions.success($translate.toasts.success.taskDeleted);
  } catch {
    toastActions.error($translate.toasts.error.taskDeleteFailed);
  }
}

function handleDragStart(event: DragEvent, taskId: string, statusColumnKey: TaskStatus) {
  event.dataTransfer!.setData('text/plain', taskId);
  draggedTaskId = taskId;
  dragSourceColumn = statusColumnKey;
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

async function handleDrop(event: DragEvent, targetColId: TaskStatus) {
  event.preventDefault();
  if (draggedTaskId && dragSourceColumn && dragSourceColumn !== targetColId) {
    try {
      await taskActions.move(draggedTaskId, dragSourceColumn, targetColId);
      toastActions.success($translate.toasts.success.taskMoved);
    } catch {
      toastActions.error($translate.toasts.error.taskMoveFailed);
    }
  }
  draggedTaskId = null;
  dragSourceColumn = null;
  dragOverColumn = null;
}

function handleDragLeave(event: DragEvent) {
  if (event.currentTarget && !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
    dragOverColumn = null;
  }
}

$effect(() => { 
  if ($selectedProjectId) {
    taskActions.loadForProject($selectedProjectId);
  }
});
</script>

{#if $selectedProject}
  <!-- Project Header -->
  <div class="rounded-xl border border-white/5 bg-[#0d0f17] p-5 mb-5 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="w-2.5 h-2.5 rounded-full {$selectedProject.status === 'active' ? 'bg-emerald-400' : $selectedProject.status === 'ended' ? 'bg-zinc-500' : 'bg-amber-400'}"></span>
        <h1 class="text-lg font-semibold tracking-tight text-zinc-100">
          {$selectedProject.title}
        </h1>
        <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-zinc-400">
          {$selectedProject.status}
        </span>
      </div>

      <div class="flex items-center gap-6 text-xs text-zinc-400">
        {#if $selectedProject.start_date}
          <div class="flex items-center gap-2">
            <span class="text-zinc-500 font-medium">{$translate.projects.headers.start_date}</span>
            <span class="font-mono text-zinc-300">{formatDate($selectedProject.start_date)}</span>
          </div>
        {/if}
        {#if $selectedProject.end_date}
          <div class="flex items-center gap-2">
            <span class="text-zinc-500 font-medium">{$translate.projects.headers.end_date}</span>
            <span class="font-mono text-zinc-300">{formatDate($selectedProject.end_date)}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Quick Deploy Task Bar -->
  <div class="rounded-xl border border-white/5 bg-[#0d0f17] p-3 mb-6 shadow-sm">
    <form onsubmit={(e) => { e.preventDefault(); addNewTask(); }} class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
      <div class="relative flex-1 min-w-[200px]">
        <input
          bind:value={newTaskTitle}
          placeholder={$translate.tasks.enterName}
          class="w-full text-xs bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      <select 
        bind:value={newTaskStatus} 
        class="text-xs bg-white/[0.03] border border-white/10 rounded-lg pl-3 pr-8 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer hover:bg-white/[0.05] transition-colors shrink-0"
      >
        <option value="todo" class="bg-[#12141c]">{$translate.tasks.columns.todo}</option>
        <option value="doing" class="bg-[#12141c]">{$translate.tasks.columns.doing}</option>
        <option value="done" class="bg-[#12141c]">{$translate.tasks.columns.done}</option>
      </select>

      <select 
        bind:value={newTaskLevel} 
        class="text-xs bg-white/[0.03] border border-white/10 rounded-lg pl-3 pr-8 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer hover:bg-white/[0.05] transition-colors shrink-0"
      >
        <option value="low" class="bg-[#12141c]">{$translate.tasks.levels.low}</option>
        <option value="medium" class="bg-[#12141c]">{$translate.tasks.levels.medium}</option>
        <option value="high" class="bg-[#12141c]">{$translate.tasks.levels.high}</option>
        <option value="critical" class="bg-[#12141c]">{$translate.tasks.levels.critical}</option>
      </select>

      <button
        type="submit"
        class="text-xs font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm shrink-0 whitespace-nowrap"
      >
        {$translate.tasks.deploy}
      </button>
    </form>
  </div>

  <!-- Kanban Columns -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    {#each Object.entries($taskColumns) as [statusColumnKey, columnTasks]}
      <div 
        class="rounded-xl border border-white/5 bg-[#0d0f17] flex flex-col transition-all {dragOverColumn === statusColumnKey ? 'ring-2 ring-indigo-500/50 border-indigo-500/30' : ''}"
        role="group"
        ondragover={(e) => { handleDragOver(e); dragOverColumn = statusColumnKey as TaskStatus; }}
        ondragleave={handleDragLeave}
        ondrop={(e) => { handleDrop(e, statusColumnKey as TaskStatus); dragOverColumn = null; }}
      >
        <div class="px-3.5 py-3 border-b border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full {statusColumnKey === 'todo' ? 'bg-amber-400' : statusColumnKey === 'doing' ? 'bg-indigo-400' : 'bg-emerald-400'}"></span>
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {statusColumnKey === 'todo' ? $translate.tasks.columns.todo : statusColumnKey === 'doing' ? $translate.tasks.columns.doing : $translate.tasks.columns.done}
            </span>
          </div>
          <span class="text-[11px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
            {columnTasks.length}
          </span>
        </div>

        <div class="p-2 space-y-2 min-h-64 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {#if $tasksLoading}
            <div class="text-center py-6 text-xs text-zinc-500">
              {$translate.tasks.loading}
            </div>
          {/if}

          {#each columnTasks as task (task.id)}
            <div
              class="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-grab active:cursor-grabbing group/card"
              draggable="true"
              ondragstart={(e) => handleDragStart(e, task.id, statusColumnKey as TaskStatus)}
              role="button"
              tabindex="0"
            >
              {#if editingTaskId === task.id}
                <div class="space-y-2">
                  <input
                    bind:value={editTaskTitle}
                    class="w-full text-xs p-2 rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    onkeydown={(e) => e.key === 'Enter' && saveTaskEdit()}
                  />
                  <div class="flex items-center justify-between gap-2">
                    <select bind:value={editTaskLevel} class="text-xs bg-black/40 border border-white/10 rounded p-1.5 text-zinc-300">
                      <option value="low">{$translate.tasks.priority.low}</option>
                      <option value="medium">{$translate.tasks.priority.medium}</option>
                      <option value="high">{$translate.tasks.priority.high}</option>
                      <option value="critical">{$translate.tasks.priority.critical}</option>
                    </select>

                    <div class="flex items-center gap-1">
                      <button onclick={saveTaskEdit} class="text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded hover:bg-emerald-500/10">Save</button>
                      <button onclick={cancelTaskEdit} class="text-xs text-zinc-400 hover:text-zinc-300 px-2 py-1 rounded hover:bg-white/5">Cancel</button>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="flex items-start justify-between gap-2">
                  <p class="text-xs text-zinc-200 leading-snug break-words flex-1 font-normal">
                    {task.title}
                  </p>

                  <div class="hidden group-hover/card:flex items-center gap-0.5 shrink-0">
                    <button
                      onclick={() => startEditTask(task)}
                      class="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                      title="Edit task"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onclick={() => deleteTask(task.id)}
                      class="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete task"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-2.5 flex items-center justify-between text-[10px]">
                  <span class="inline-flex items-center gap-1 font-mono uppercase px-1.5 py-0.5 rounded border border-white/5 {task.level === 'critical' ? 'text-rose-400 bg-rose-500/10' : task.level === 'high' ? 'text-amber-400 bg-amber-500/10' : task.level === 'medium' ? 'text-sky-400 bg-sky-500/10' : 'text-zinc-400 bg-white/[0.02]'}">
                    <span class="w-1 h-1 rounded-full {task.level === 'critical' ? 'bg-rose-400' : task.level === 'high' ? 'bg-amber-400' : task.level === 'medium' ? 'bg-sky-400' : 'bg-zinc-400'}"></span>
                    {task.level}
                  </span>
                </div>
              {/if}
            </div>
          {/each}

          {#if columnTasks.length === 0 && !$tasksLoading}
            <div class="py-8 text-center text-xs text-zinc-600 italic">
              {$translate.global.noAnomalyDetected}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-6">
    <DeadlineBar 
      newProjectStartDate={$selectedProject.start_date} 
      newProjectEndDate={$selectedProject.end_date}
    />
  </div>

{:else if $selectedProjectId}
  <div class="flex justify-center items-center h-64">
    <div class="text-center">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400 mx-auto mb-2"></div>
      <p class="text-xs text-zinc-500">{$translate.global.preparingBoard}</p>
    </div>
  </div>
{/if}