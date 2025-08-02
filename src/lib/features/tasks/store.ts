import { writable, derived, get } from 'svelte/store';
// DEMO
import { taskApi } from '../../database/supabase';
import type { 
  Task, 
  TaskColumns, 
  TaskView, 
  TaskStatus,
  CreateTaskData, 
  UpdateTaskData 
} from './interfaces.js';
import { toastActions } from '../toasts/store.js';

const _tasks = writable<Task[]>([]);
const _loading = writable(false);
const _currentProjectId = writable<number | null>(null);

export const tasksLoading = { subscribe: _loading.subscribe };

export const taskColumns = derived(_tasks, (tasks): TaskColumns => {
  const columns: TaskColumns = { todo: [], doing: [], done: [] };
  
  tasks.forEach(task => {
    const taskView: TaskView = {
      id: task.id,
      title: task.title,
      status: task.status,
      level: task.level
    };
    columns[task.status].push(taskView);
  });
  
  return columns;
});

// ACTIONS
export const taskActions = {
  async loadForProject(projectId: number | null) {
    if (!projectId) {
      _tasks.set([]);
      _currentProjectId.set(null);
      return;
    }
    _loading.set(true);
    try {
      const tasks = await taskApi.getByProject(projectId);
      _tasks.set(tasks);
      _currentProjectId.set(projectId);
    } catch {
      toastActions.warning("Failed to load tasks for project");
      _tasks.set([]);
    } finally {
      _loading.set(false);
    }
  },

async create(data: CreateTaskData) {
    _loading.set(true);
    try {
      const newTask = await taskApi.create(data);
      await taskApi.updatedAt(data.project_id);
      _tasks.update(tasks => {
        return [...tasks, newTask];
      });
      return newTask;
    } catch {
      toastActions.warning("Failed to create task");
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async update(taskId: number, updates: UpdateTaskData) {
    _loading.set(true);
    // get project id from _tasks
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id;

    try {
      await taskApi.update(taskId, updates);
      await taskApi.updatedAt(projectId || 0);
      _tasks.update(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch {
      toastActions.warning("Failed to update task");
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async delete(taskId: number) {
    _loading.set(true);
    // get project id from _tasks
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id;
    try {
      await taskApi.delete(taskId);
      await taskApi.updatedAt(projectId || 0);
      _tasks.update(tasks => 
        tasks.filter(task => task.id !== taskId)
      );
    } catch {
      toastActions.warning("Failed to delete task");
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async move(taskId: number, fromStatus: TaskStatus, toStatus: TaskStatus) {
    if (fromStatus === toStatus) return;
    // get project id from _tasks
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id;
    try {
      _tasks.update(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, status: toStatus } : task 
        )
      );
      await taskApi.update(taskId, { status: toStatus});
      await taskApi.updatedAt(projectId || 0);
    } catch {
      toastActions.warning("Failed to move task");
      _tasks.update(tasks => tasks.map(task => task.id === taskId ? { ...task, status: fromStatus} : task ));
    }
  },
};