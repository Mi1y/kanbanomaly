import { appDataDir, join } from '@tauri-apps/api/path';
import { exists, mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

let dataDirCache: string | null = null;
let projectsDirCache: string | null = null;
let projectsIndexPathCache: string | null = null;

export async function getLocalDataDir(): Promise<string> {
  if (dataDirCache) return dataDirCache;
  try {
    const base = await appDataDir();
    dataDirCache = await join(base, 'kanban_data');
  } catch (err) {
    console.warn('Tauri appDataDir not available, falling back to .kanban_data', err);
    dataDirCache = '.kanban_data';
  }
  return dataDirCache;
}

export async function getProjectsDir(): Promise<string> {
  if (projectsDirCache) return projectsDirCache;
  const base = await getLocalDataDir();
  projectsDirCache = await join(base, 'projects');
  return projectsDirCache;
}

export async function getProjectsIndexPath(): Promise<string> {
  if (projectsIndexPathCache) return projectsIndexPathCache;
  const base = await getLocalDataDir();
  projectsIndexPathCache = await join(base, 'projects.json');
  return projectsIndexPathCache;
}

export async function initLocalStorage(): Promise<void> {
  try {
    const dataDir = await getLocalDataDir();
    const dataDirExists = await exists(dataDir);
    if (!dataDirExists) {
      await mkdir(dataDir, { recursive: true });
    }

    const projectsDir = await getProjectsDir();
    const projectsDirExists = await exists(projectsDir);
    if (!projectsDirExists) {
      await mkdir(projectsDir, { recursive: true });
    }

    const indexPath = await getProjectsIndexPath();
    const indexExists = await exists(indexPath);
    if (!indexExists) {
      await writeTextFile(indexPath, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize local storage:', error);
  }
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const fileExists = await exists(filePath);
    if (!fileExists) return fallback;
    const content = await readTextFile(filePath);
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading JSON file at ${filePath}:`, err);
    return fallback;
  }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await writeTextFile(filePath, content);
}
