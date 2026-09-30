import { join } from '@tauri-apps/api/path';
import { 
  initLocalStorage, 
  getProjectsDir, 
  readJsonFile, 
  writeJsonFile 
} from '../../database/local';
import type { Task, CreateTaskData, UpdateTaskData } from './interfaces';
import type { ProjectFileContent } from '../projects/interfaces';

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

export const localTaskApi = {
  async getByProject(projectId: string): Promise<Task[]> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    const content = await readJsonFile<ProjectFileContent | null>(filePath, null);
    return content?.tasks || [];
  },

  async create(taskData: CreateTaskData): Promise<Task> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(taskData.project_id);
    const content = await readJsonFile<ProjectFileContent | null>(filePath, null);
    if (!content) {
      throw new Error(`Project ${taskData.project_id} not found`);
    }

    const newTask: Task = {
      id: generateUuid(),
      title: taskData.title,
      status: taskData.status,
      level: taskData.level,
      project_id: taskData.project_id
    };

    content.tasks = [...(content.tasks || []), newTask];
    content.updated_at = new Date().toISOString();
    await writeJsonFile(filePath, content);

    return newTask;
  },

  async update(taskId: string, updates: UpdateTaskData, projectId: string): Promise<void> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    const content = await readJsonFile<ProjectFileContent | null>(filePath, null);
    if (!content) return;

    content.tasks = (content.tasks || []).map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates };
      }
      return task;
    });
    content.updated_at = new Date().toISOString();
    await writeJsonFile(filePath, content);
  },

  async delete(taskId: string, projectId: string): Promise<void> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    const content = await readJsonFile<ProjectFileContent | null>(filePath, null);
    if (!content) return;

    content.tasks = (content.tasks || []).filter(task => task.id !== taskId);
    content.updated_at = new Date().toISOString();
    await writeJsonFile(filePath, content);
  },

  async updatedAt(projectId: string): Promise<void> {
    await initLocalStorage();
    const filePath = await getProjectFilePath(projectId);
    const content = await readJsonFile<ProjectFileContent | null>(filePath, null);
    if (!content) return;
    content.updated_at = new Date().toISOString();
    await writeJsonFile(filePath, content);
  }
};
