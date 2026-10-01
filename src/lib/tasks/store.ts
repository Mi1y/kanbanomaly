import { writable, derived, get } from 'svelte/store';
import { taskApi } from '../database/supabase';
import type {
  Task,
  TaskColumns,
  TaskView,
  TaskStatus,
  CreateTaskData,
  UpdateTaskData
} from './interfaces';
import { getTranslation } from '$lib';
import { toastActions } from '$lib';

const _tasks = writable<Task[]>([]);
const _loading = writable(false);
const _currentProjectId = writable<string | null>(null);

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

export const taskActions = {
  async loadForProject(projectId: string | null) {
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
      toastActions.warning(getTranslation("toasts.error.taskLoadFailed"));
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
      toastActions.warning(getTranslation("toasts.error.taskCreateFailed"));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async update(taskId: string, updates: UpdateTaskData) {
    _loading.set(true);
    const task = get(_tasks).find(t => t.id === taskId);
    const projectId = task?.project_id;

    try {
      await taskApi.update(taskId, updates);
      if (projectId) await taskApi.updatedAt(projectId);
      _tasks.update(tasks =>
        tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
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
    const projectId = task?.project_id;
    try {
      await taskApi.delete(taskId);
      if (projectId) await taskApi.updatedAt(projectId);
      _tasks.update(tasks =>
        tasks.filter(task => task.id !== taskId)
      );
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
    const projectId = task?.project_id;
    try {
      _tasks.update(tasks =>
        tasks.map(task =>
          task.id === taskId ? { ...task, status: toStatus } : task
        )
      );
      await taskApi.update(taskId, { status: toStatus });
      if (projectId) await taskApi.updatedAt(projectId);
    } catch {
      toastActions.warning(getTranslation("toasts.error.taskMoveFailed"));
      _tasks.update(tasks => tasks.map(task => task.id === taskId ? { ...task, status: fromStatus } : task));
    }
  },
};