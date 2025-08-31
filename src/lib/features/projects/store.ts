import { writable, derived } from 'svelte/store';
import { projectApi } from './api';
import type { 
  Project, 
  ProjectView, 
  ProjectSummary,
  CreateProjectData, 
  UpdateProjectData, 
} from './interfaces';
import { getTranslation } from '../translator/store';
import { toastActions } from '../toasts/store';

const _projects = writable<Project[]>([]);
const _selectedProjectId = writable<number | null>(null);
const _selectedProject = writable<Project | null>(null);
const _loading = writable(false);

export const projectsLoading = { subscribe: _loading.subscribe };

export const projectList = derived(_projects, (projects): ProjectSummary[] => 
  projects.map(p => ({ id: p.id, title: p.title, status: p.status }))
);

export const selectedProject = derived(_selectedProject, (project): ProjectView | null => 
  project ? {
    id: project.id,
    title: project.title,
    status: project.status,
    start_date: project.start_date,
    end_date: project.end_date
  } : null
);

export const selectedProjectId = { subscribe: _selectedProjectId.subscribe };


// ACTIONS
export const projectActions = {

  async getById(projectId: number): Promise<ProjectView | null> {
    try {
      const project = await projectApi.getById(projectId);
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
      const projects = await projectApi.getAll();
      _projects.set(projects);
    } catch {
      toastActions.error(getTranslation('toasts.error.projectsLoadFailed'));
      _projects.set([]);
    } finally {
      _loading.set(false);
    }
  },

  async select(projectId: number | null) {
    _selectedProjectId.set(projectId);
    
    if (!projectId) {
      _selectedProject.set(null);
      return;
    }

    try {
      const project = await projectApi.getById(projectId);
      _selectedProject.set(project);
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectLoadDetailsFailed'));
      _selectedProject.set(null);
    }
  },

  async create(data: CreateProjectData) {
    _loading.set(true);
    try {
      const newProject = await projectApi.create(data);
      _projects.update(projects =>
         [...projects, newProject]
        );
      return newProject;
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectCreateFailed'));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async update(projectId: number, updates: UpdateProjectData) {
    _loading.set(true);
    try {
      await projectApi.update(projectId, updates);
    } catch {
      toastActions.warning(getTranslation('toasts.error.projectUpdateFailed'));
      return null;
    } finally {
      _loading.set(false);
    }
  },

  async delete(projectId: number) {
    _loading.set(true);
    try {
      await projectApi.delete(projectId);
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