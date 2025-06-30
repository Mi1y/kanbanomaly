import { writable } from 'svelte/store';
import { supabase } from '$lib/database/supabase';
import type { Project } from '$lib/interfaces/projects';

export const projects = writable<Project[]>([]);
export const selectedProjectId = writable<number | null>(null);
export const selectedProject = writable<Project | null>(null);

export const projectsLoading = writable(false);

export const projectStore = {
  async loadProjects() {
    projectsLoading.set(true);
    try {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) throw error;
      projects.set(data || []);
    } catch (error) {
      console.error("Error loading projects", error);
    } finally {
      projectsLoading.set(false);
    }
  },

  async loadProject(projectId: number) {
    if (!projectId) {
      selectedProject.set(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
        
      if (error) throw error;
      selectedProject.set(data);
    } catch (error) {
      console.error("Error loading project", error);
      selectedProject.set(null);
    }
  },

  async createProject(projectData: {
    title: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    if (!projectData.title.trim()) {
      throw new Error("Project title is required");
    }
    
    const newProject = {
      title: projectData.title,
      start_date: projectData.start_date ? new Date(projectData.start_date) : null,
      end_date: projectData.end_date ? new Date(projectData.end_date) : null
    };
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();
        
      if (error) throw error;
      
      projects.update(currentProjects => [...currentProjects, data[0]]);
      
      return data[0];
    } catch (error) {
      console.error("Error creating project", error);
      throw error;
    }
  },

  async updateProject(projectId: number, updates: { title: string }) {
    if (!updates.title.trim()) {
      throw new Error("Project title is required");
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);
        
      if (error) throw error;
      
      projects.update(currentProjects => 
        currentProjects.map(project => 
          project.id === projectId ? { ...project, ...updates } : project
        )
      );
      
      selectedProject.update(current => 
        current?.id === projectId ? { ...current, ...updates } : current
      );
    } catch (error) {
      console.error("Error updating project", error);
      throw error;
    }
  },

  async deleteProject(projectId: number) {
    try {
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
      
      projects.update(currentProjects => 
        currentProjects.filter(project => project.id !== projectId)
      );
      
      selectedProjectId.update(current => 
        current === projectId ? null : current
      );
      
      selectedProject.update(current => 
        current?.id === projectId ? null : current
      );
    } catch (error) {
      console.error("Error deleting project", error);
      throw error;
    }
  },

  selectProject(projectId: number | null) {
    selectedProjectId.set(projectId);
    if (projectId) {
      this.loadProject(projectId);
    } else {
      selectedProject.set(null);
    }
  }
};