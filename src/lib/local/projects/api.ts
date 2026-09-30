import { join } from '@tauri-apps/api/path';
import { remove } from '@tauri-apps/plugin-fs';
import {
  initLocalStorage,
  getProjectsDir,
  getProjectsIndexPath,
  readJsonFile,
  writeJsonFile
} from '../../database/local';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectFileContent
} from './interfaces';

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getProjectFilePath(projectId: string): Promise<string> {
  const projectsDir = await getProjectsDir();
  return await join(projectsDir, `${projectId}.json`);
}

export const localProjectApi = {
  async getAll(): Promise<Project[]> {
    await initLocalStorage();
    const indexPath = await getProjectsIndexPath();
    const list = await readJsonFile<Project[]>(indexPath, []);
    return list;
  },

  async getById(projectId: string): Promise<Project | null> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    const content = await readJsonFile<ProjectFileContent | null>(filePath, null);
    if (!content) return null;
    const { tasks: _, ...project } = content;
    return project;
  },

  async create(projectData: CreateProjectData): Promise<Project> {
    await initLocalStorage();
    const id = generateUuid();
    const newProject: Project = {
      id,
      title: projectData.title,
      status: projectData.status,
      start_date: projectData.start_date || null,
      end_date: projectData.end_date || null,
      updated_at: new Date().toISOString()
    };

    const filePath = await getProjectFilePath(id);
    const fileContent: ProjectFileContent = {
      ...newProject,
      tasks: []
    };
    await writeJsonFile(filePath, fileContent);

    const indexPath = await getProjectsIndexPath();
    const currentList = await readJsonFile<Project[]>(indexPath, []);
    const updatedList = [newProject, ...currentList];
    await writeJsonFile(indexPath, updatedList);

    return newProject;
  },

  async update(projectId: string, updates: UpdateProjectData): Promise<void> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    const existing = await readJsonFile<ProjectFileContent | null>(filePath, null);
    if (!existing) {
      throw new Error(`Project ${projectId} not found`);
    }

    const updatedProject: ProjectFileContent = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };
    await writeJsonFile(filePath, updatedProject);

    const indexPath = await getProjectsIndexPath();
    const currentList = await readJsonFile<Project[]>(indexPath, []);
    const updatedList = currentList.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          ...updates,
          updated_at: updatedProject.updated_at
        };
      }
      return p;
    });
    await writeJsonFile(indexPath, updatedList);
  },

  async delete(projectId: string): Promise<void> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    try {
      await remove(filePath);
    } catch (err) {
      console.warn(`Could not remove project file ${filePath}`, err);
    }
    const indexPath = await getProjectsIndexPath();
    const currentList = await readJsonFile<Project[]>(indexPath, []);
    const updatedList = currentList.filter(p => p.id !== projectId);
    await writeJsonFile(indexPath, updatedList);
  },

  async updatedAt(projectId: string): Promise<void> {
    await this.update(projectId, {});
  }
};
