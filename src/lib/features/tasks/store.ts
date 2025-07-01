import { writable, derived } from 'svelte/store';
import { taskApi } from './api.js';
import type { 
  Task, 
  TaskColumns, 
  TaskView, 
  TaskStatus,
  CreateTaskData, 
  UpdateTaskData 
} from './interfaces.js';

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
    } catch (error) {
      console.error("Error loading tasks", error);
      _tasks.set([]);
    } finally {
      _loading.set(false);
    }
  },

async create(data: CreateTaskData) {
    _loading.set(true);
    try {
      const newTask = await taskApi.create(data);
      _tasks.update(tasks => {
        return [...tasks, newTask];
      });
      return newTask;
    } catch (error) {
      console.error("❌ Error creating task", error);
      throw error;
    } finally {
      _loading.set(false);
    }
  },

  async update(taskId: number, updates: UpdateTaskData) {
    _loading.set(true);
    try {
      await taskApi.update(taskId, updates);
      _tasks.update(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error("Error updating task", error);
      throw error;
    } finally {
      _loading.set(false);
    }
  },

  async delete(taskId: number) {
    _loading.set(true);
    try {
      await taskApi.delete(taskId);
      _tasks.update(tasks => tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
      throw error;
    } finally {
      _loading.set(false);
    }
  },

  async move(taskId: number, fromStatus: TaskStatus, toStatus: TaskStatus) {
    if (fromStatus === toStatus) return;
    
    try {
      _tasks.update(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, status: toStatus } : task
        )
      );
      
      await taskApi.update(taskId, { status: toStatus});
    } catch (error) {
      _tasks.update(tasks => 
        tasks.map(task => 
          task.id === taskId ? { ...task, status: fromStatus} : task
        )
      );
      throw error;
    }
  }
};