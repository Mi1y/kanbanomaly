import { get } from 'svelte/store';
import { dataSource } from '../features/settings/store';
import { projectActions, type UnifiedProjectView } from './unifiedProjects';
import { localProjectApi } from '../local/projects/api';
import { localTaskApi } from '../local/tasks/api';
import { projectApi as supabaseProjectApi } from '../supabase/projects/api';
import { taskApi as supabaseTaskApi } from '../supabase/tasks/api';
import type { TaskStatus, TaskLevel } from '../supabase/tasks/interfaces';

export interface ExportedTask {
  id?: string;
  title: string;
  status: TaskStatus;
  level: TaskLevel;
}

export interface ExportedProject {
  id?: string;
  title: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  tasks: ExportedTask[];
}

export interface ExportBackupData {
  version: '2.0';
  exported_at: string;
  source: 'local' | 'supabase';
  projects: ExportedProject[];
}

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

function downloadJson(data: object, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportImportService = {
  async getProjectWithTasks(projectId: string, sourceOverride?: 'local' | 'supabase'): Promise<ExportedProject | null> {
    const source = sourceOverride || get(dataSource);

    if (source === 'local') {
      const proj = await localProjectApi.getById(projectId);
      if (!proj) return null;
      const tasks = await localTaskApi.getByProject(projectId);
      return {
        id: proj.id,
        title: proj.title,
        status: proj.status,
        start_date: proj.start_date ? new Date(proj.start_date).toISOString() : null,
        end_date: proj.end_date ? new Date(proj.end_date).toISOString() : null,
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          level: t.level
        }))
      };
    } else {
      const proj = await supabaseProjectApi.getById(projectId);
      if (!proj) return null;
      const tasks = await supabaseTaskApi.getByProject(projectId);
      return {
        id: proj.id,
        title: proj.title,
        status: proj.status,
        start_date: proj.start_date ? new Date(proj.start_date).toISOString() : null,
        end_date: proj.end_date ? new Date(proj.end_date).toISOString() : null,
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          level: t.level
        }))
      };
    }
  },

  async exportSingleProject(projectId: string): Promise<string> {
    const source = get(dataSource);
    const data = await this.getProjectWithTasks(projectId);
    if (!data) throw new Error(`Project ${projectId} not found`);

    const backup: ExportBackupData = {
      version: '2.0',
      exported_at: new Date().toISOString(),
      source,
      projects: [data]
    };

    const safeTitle = data.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const filename = `${safeTitle || 'project'}_backup.json`;
    downloadJson(backup, filename);
    return data.title;
  },

  async exportAllProjects(): Promise<number> {
    const source = get(dataSource);
    const allSummaries = source === 'local' 
      ? await localProjectApi.getAll() 
      : await supabaseProjectApi.getAll();

    const fullProjects: ExportedProject[] = [];

    for (const p of allSummaries) {
      const item = await this.getProjectWithTasks(p.id, source);
      if (item) {
        fullProjects.push(item);
      }
    }

    const backup: ExportBackupData = {
      version: '2.0',
      exported_at: new Date().toISOString(),
      source,
      projects: fullProjects
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `kanbanomaly_${source}_backup_${dateStr}.json`;
    downloadJson(backup, filename);
    return fullProjects.length;
  },

  async importFromJson(jsonText: string): Promise<number> {
    const source = get(dataSource);
    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error('Invalid JSON format');
    }

    let projectsToImport: ExportedProject[] = [];

    if (parsed && Array.isArray(parsed.projects)) {
      projectsToImport = parsed.projects;
    } else if (parsed && typeof parsed.title === 'string') {
      projectsToImport = [parsed];
    } else if (Array.isArray(parsed)) {
      projectsToImport = parsed;
    } else {
      throw new Error('Unsupported project backup structure');
    }

    let importedCount = 0;

    for (const projData of projectsToImport) {
      if (!projData.title) continue;

      let newProjectId = generateUuid();

      if (source === 'local') {
        const created = await localProjectApi.create({
          title: projData.title,
          status: projData.status || 'active',
          start_date: projData.start_date || null,
          end_date: projData.end_date || null
        });
        newProjectId = created.id;

        if (Array.isArray(projData.tasks)) {
          for (const task of projData.tasks) {
            if (!task.title) continue;
            await localTaskApi.create({
              title: task.title,
              status: task.status || 'todo',
              level: task.level || 'medium',
              project_id: newProjectId
            });
          }
        }
      } else {
        const created = await supabaseProjectApi.create({
          title: projData.title,
          status: projData.status || 'active',
          start_date: projData.start_date ? new Date(projData.start_date) : null,
          end_date: projData.end_date ? new Date(projData.end_date) : null
        });
        newProjectId = created.id;

        if (Array.isArray(projData.tasks)) {
          for (const task of projData.tasks) {
            if (!task.title) continue;
            await supabaseTaskApi.create({
              title: task.title,
              status: task.status || 'todo',
              level: task.level || 'medium',
              project_id: newProjectId
            });
          }
        }
      }

      importedCount++;
    }

    await projectActions.loadAll();
    return importedCount;
  }
};
