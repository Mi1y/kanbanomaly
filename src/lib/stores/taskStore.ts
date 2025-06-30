import { writable } from 'svelte/store';
import { supabase } from '$lib/database/supabase';
import type { Task } from '$lib/interfaces/tasks';

export const tasks = writable<Record<string, Task[]>>({
  todo: [],
  doing: [],
  done: []
});

export const tasksLoading = writable(false);

export const taskStore = {
  async loadTasksForProject(projectId: number | null) {
    if (!projectId) {
      tasks.set({ todo: [], doing: [], done: [] });
      return;
    }
    
    tasksLoading.set(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId);
      
      if (error) throw error;
      
      const taskColumns = {
        todo: data?.filter(task => task.status === 'todo') || [],
        doing: data?.filter(task => task.status === 'doing') || [],
        done: data?.filter(task => task.status === 'done') || [],
      };
      
      tasks.set(taskColumns);
    } catch (error) {
      console.error("Error loading tasks", error);
      tasks.set({ todo: [], doing: [], done: [] });
    } finally {
      tasksLoading.set(false);
    }
  },

  async createTask(taskData: {
    title: string;
    status: string;
    level: string;
    project_id: number;
  }) {
    if (!taskData.title.trim() || !taskData.project_id) {
      throw new Error("Task title and project ID are required");
    }
    
    tasksLoading.set(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();
        
      if (error) throw error;
      
      tasks.update(currentTasks => ({
        ...currentTasks,
        [taskData.status]: [...currentTasks[taskData.status], data[0]]
      }));
      
      return data[0];
    } catch (error) {
      console.error("Error adding task", error);
      throw error;
    } finally {
      tasksLoading.set(false);
    }
  },

  async updateTask(taskId: number, updates: {
    title?: string;
    level?: string;
    status?: string;
  }) {
    tasksLoading.set(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
        
      if (error) throw error;
      
      tasks.update(currentTasks => {
        const newTasks = { ...currentTasks };
        
        Object.keys(newTasks).forEach(columnKey => {
          newTasks[columnKey] = newTasks[columnKey].map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          );
        });
        
        return newTasks;
      });
    } catch (error) {
      console.error("Error updating task", error);
      throw error;
    } finally {
      tasksLoading.set(false);
    }
  },

  async deleteTask(taskId: number) {
    tasksLoading.set(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      tasks.update(currentTasks => {
        const newTasks = { ...currentTasks };
        Object.keys(newTasks).forEach(columnKey => {
          newTasks[columnKey] = newTasks[columnKey].filter(task => task.id !== taskId);
        });
        return newTasks;
      });
    } catch (error) {
      console.error("Error deleting task", error);
      throw error;
    } finally {
      tasksLoading.set(false);
    }
  },

  async moveTask(taskId: number, fromStatus: string, toStatus: string) {
    if (fromStatus === toStatus) return;
    
    try {
      await this.updateTask(taskId, { status: toStatus });
      
      tasks.update(currentTasks => {
        const newTasks = { ...currentTasks };
        
        const taskIndex = newTasks[fromStatus].findIndex(t => t.id === taskId);
        if (taskIndex === -1) return currentTasks;
        
        const task = newTasks[fromStatus][taskIndex];
        
        newTasks[fromStatus] = newTasks[fromStatus].filter(t => t.id !== taskId);
        
        newTasks[toStatus] = [...newTasks[toStatus], { ...task, status: toStatus }];
        
        return newTasks;
      });
    } catch (error) {
      console.error("Error moving task", error);
      throw error;
    }
  }
};