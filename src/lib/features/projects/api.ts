import { supabase } from '../../database/supabase';
import type { Project, CreateProjectData, UpdateProjectData } from './interfaces';

export const projectApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(projectId: number): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
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

  async update(projectId: number, updates: UpdateProjectData): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);
      
    if (error) throw error;
  },

  async delete(projectId: number): Promise<void> {
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId);
      
    if (tasksError) throw tasksError;
    
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (projectError) throw projectError;
  },
  
  async updatedAt(projectId: number): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', projectId);
      
    if (error) throw error;
  },
};