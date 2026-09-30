import { writable, derived } from 'svelte/store';
import { localProjectApi } from './api';
import type { 
  Project, 
  ProjectView, 
  ProjectSummary,
  CreateProjectData, 
  UpdateProjectData, 
} from './interfaces';
import { getTranslation, toastActions } from '$lib';

const _projects = writable<Project[]>([]);
const _selectedProjectId = writable<string | null>(null);
const _selectedProject = writable<Project | null>(null);
const _loading = writable(false);

export const localProjectsLoading = { subscribe: _loading.subscribe };

export const localProjectList = derived(_projects, (projects): ProjectSummary[] => 
  projects.map(p => ({ id: p.id, title: p.title, status: p.status }))
);

export const localSelectedProject = derived(_selectedProject, (project): ProjectView | null => 
  project ? {
    id: project.id,
    title: project.title,
    status: project.status,
    start_date: project.start_date,
    end_date: project.end_date
  } : null
);

export const localSelectedProjectId = { subscribe: _selectedProjectId.subscribe };

export const localProjectActions = {
  async getById(projectId: string): Promise<ProjectView | null> {
    try {
      const project = await localProjectApi.getById(projectId);
      return project ? {
        id: project.id,
        title: project.title,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date
      } : null;
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectLoadDetailsFailed'));
      return null;
    }
  },

  async loadAll() {
    _loading.set(true);
    try {
      const projects = await localProjectApi.getAll();
      _projects.set(projects);
    } catch {
      toastActions.error(getTranslation('toasts.error.projectsLoadFailed'));
      _projects.set([]);
    } finally {
      _loading.set(false);
    }
  },

  async select(projectId: string | null) {
    _selectedProjectId.set(projectId);
    
    if (!projectId) {
      _selectedProject.set(null);
      return;
    }

    try {
      const project = await localProjectApi.getById(projectId);
      _selectedProject.set(project);
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectLoadDetailsFailed'));
      _selectedProject.set(null);
    }
  },

  async create(data: CreateProjectData) {
    _loading.set(true);
    try {
      const newProject = await localProjectApi.create(data);
      _projects.update(projects => [newProject, ...projects]);
      return newProject;
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectCreateFailed'));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async update(projectId: string, updates: UpdateProjectData) {
    _loading.set(true);
    try {
      await localProjectApi.update(projectId, updates);
      _projects.update(projects => 
        projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
      );
      _selectedProject.update(current => 
        current?.id === projectId ? { ...current, ...updates } : current
      );
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectUpdateFailed'));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async delete(projectId: string) {
    _loading.set(true);
    try {
      await localProjectApi.delete(projectId);
      _projects.update(projects => 
        projects.filter(project => project.id !== projectId)
      );
      _selectedProjectId.update(current => 
        current === projectId ? null : current
      );
      _selectedProject.update(current => 
        current?.id === projectId ? null : current
      );
    } catch {
      toastActions.error(getTranslation('toasts.error.projectDeleteFailed'));
      return null;
    } finally {
      _loading.set(false);
    }
  },
};
