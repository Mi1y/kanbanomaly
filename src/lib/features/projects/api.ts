import { supabase } from '../../database/supabase';
import type { Project, CreateProjectData, UpdateProjectData } from './interfaces.js';

export const projectApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      throw error;
    }
    return data;
  },

  async create(projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: projectData.title,
        status: projectData.status,
        start_date: projectData.start_date,
        end_date: projectData.end_date
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: UpdateProjectData): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
  },

  async delete(id: number): Promise<void> {
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('project_id', id);
      
    if (tasksError) throw tasksError;
    
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (projectError) throw projectError;
  }
};