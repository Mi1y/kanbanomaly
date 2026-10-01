import { projectApi } from '../database/supabase';
import { taskApi } from '../database/supabase';
import { projectActions } from '../projects/store';
import type { TaskStatus, TaskLevel } from '../tasks/interfaces';

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
  source: 'demo';
  projects: ExportedProject[];
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
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
  async getProjectWithTasks(projectId: string): Promise<ExportedProject | null> {
    const project = await projectApi.getById(projectId);
    if (!project) return null;

    const tasks = await taskApi.getByProject(projectId);

    return {
      id: project.id,
      title: project.title,
      status: project.status,
      start_date: project.start_date ? new Date(project.start_date).toISOString() : null,
      end_date: project.end_date ? new Date(project.end_date).toISOString() : null,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        level: t.level
      }))
    };
  },

  async exportSingleProject(projectId: string): Promise<void> {
    const data = await this.getProjectWithTasks(projectId);
    if (!data) throw new Error('Project not found');

    const cleanTitle = data.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${cleanTitle}_project_demo.json`;
    downloadJson(data, filename);
  },

  async exportAllProjects(): Promise<number> {
    const allSummaries = await projectApi.getAll();
    const fullProjects: ExportedProject[] = [];

    for (const p of allSummaries) {
      const item = await this.getProjectWithTasks(p.id);
      if (item) {
        fullProjects.push(item);
      }
    }

    const backup: ExportBackupData = {
      version: '2.0',
      exported_at: new Date().toISOString(),
      source: 'demo',
      projects: fullProjects
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `kanbanomaly_demo_backup_${dateStr}.json`;
    downloadJson(backup, filename);
    return fullProjects.length;
  },

  async importFromJson(jsonText: string): Promise<number> {
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

      const created = await projectApi.create({
        title: projData.title,
        status: projData.status || 'active',
        start_date: projData.start_date ? new Date(projData.start_date) : null,
        end_date: projData.end_date ? new Date(projData.end_date) : null
      });

      if (Array.isArray(projData.tasks)) {
        for (const task of projData.tasks) {
          if (!task.title) continue;
          await taskApi.create({
            title: task.title,
            status: task.status || 'todo',
            level: task.level || 'medium',
            project_id: created.id
          });
        }
      }

      importedCount++;
    }

    await projectActions.loadAll();
    return importedCount;
  }
};
