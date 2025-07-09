import { supabase } from '../../database/supabase';
import type { Task, CreateTaskData, UpdateTaskData } from './interfaces';

export const taskApi = {
  async getByProject(projectId: number): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId);
    
    if (error) throw error;
    return data || [];
  },

  async create(taskData: CreateTaskData): Promise<Task> {
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    return data;
  },

  async update(taskId: number, updates: UpdateTaskData): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);
      
    if (error) throw error;
  },

  async delete(taskId: number): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
  },

  async updatedAt(projectId: number): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', projectId);
      
    if (error) throw error;
  },
};