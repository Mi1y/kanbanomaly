import { writable, derived, get } from 'svelte/store';
import { localTaskApi } from './api';
import type { 
  Task, 
  TaskColumns, 
  TaskView, 
  TaskStatus, 
  CreateTaskData, 
  UpdateTaskData 
} from './interfaces';
import { getTranslation, toastActions } from '$lib';

const _tasks = writable<Task[]>([]);
const _loading = writable(false);
const _currentProjectId = writable<string | null>(null);

export const localTasksLoading = { subscribe: _loading.subscribe };

export const localTaskColumns = derived(_tasks, (tasks): TaskColumns => {
  const columns: TaskColumns = { todo: [], doing: [], done: [] };
  
  tasks.forEach(task => {
    const taskView: TaskView = {
      id: task.id,
      title: task.title,
      status: task.status,
      level: task.level
    };
    if (columns[task.status]) {
      columns[task.status].push(taskView);
    }
  });
  
  return columns;
});

export const localTaskActions = {
  async loadForProject(projectId: string | null) {
    if (!projectId) {
      _tasks.set([]);
      _currentProjectId.set(null);
      return;
    }
    _loading.set(true);
    try {
      const tasks = await localTaskApi.getByProject(projectId);
      _tasks.set(tasks);
      _currentProjectId.set(projectId);
    } catch {
      toastActions.warning(getTranslation("toasts.error.taskLoadFailed"));
      _tasks.set([]);
    } finally {
      _loading.set(false);
    }
  },

  async create(data: CreateTaskData) {
    _loading.set(true);
    try {
      const newTask = await localTaskApi.create(data);
      _tasks.update(tasks => [...tasks, newTask]);
      return newTask;
    } catch {
      toastActions.warning(getTranslation("toasts.error.taskCreateFailed"));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async update(taskId: string, updates: UpdateTaskData) {
    _loading.set(true);
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id || get(_currentProjectId);
    if (!projectId) {
      _loading.set(false);
      return null;
    }

    try {
      await localTaskApi.update(taskId, updates, projectId);
      _tasks.update(tasks => 
        tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      );
    } catch {
      toastActions.warning(getTranslation("toasts.error.taskUpdateFailed"));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async delete(taskId: string) {
    _loading.set(true);
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id || get(_currentProjectId);
    if (!projectId) {
      _loading.set(false);
      return null;
    }

    try {
      await localTaskApi.delete(taskId, projectId);
      _tasks.update(tasks => tasks.filter(t => t.id !== taskId));
    } catch {
      toastActions.warning(getTranslation("toasts.error.taskDeleteFailed"));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async move(taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) {
    if (fromStatus === toStatus) return;
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id || get(_currentProjectId);
    if (!projectId) return;

    try {
      _tasks.update(tasks => 
        tasks.map(t => t.id === taskId ? { ...t, status: toStatus } : t)
      );
      await localTaskApi.update(taskId, { status: toStatus }, projectId);
    } catch {
      toastActions.warning(getTranslation("toasts.error.taskMoveFailed"));
      _tasks.update(tasks => 
        tasks.map(t => t.id === taskId ? { ...t, status: fromStatus } : t)
      );
    }
  },
};
