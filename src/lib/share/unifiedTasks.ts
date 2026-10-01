import { derived, get } from 'svelte/store';
import { dataSource } from '../features/settings/store';
import { 
  taskColumns as supabaseTaskColumns, 
  tasksLoading as supabaseTasksLoading, 
  taskActions as supabaseTaskActions 
} from '../supabase/tasks/store';
import { 
  localTaskColumns, 
  localTasksLoading, 
  localTaskActions 
} from '../local/tasks/store';
import type { TaskStatus, TaskLevel } from '../supabase/tasks/interfaces';

export interface UnifiedTaskView {
  id: string;
  title: string;
  status: TaskStatus;
  level: TaskLevel;
}

export type UnifiedTaskColumns = Record<TaskStatus, UnifiedTaskView[]>;

export interface UnifiedCreateTaskData {
  title: string;
  status: TaskStatus;
  level: TaskLevel;
  project_id: string;
}

export interface UnifiedUpdateTaskData {
  title?: string;
  level?: TaskLevel;
  status?: TaskStatus;
}

export const tasksLoading = derived(
  [dataSource, localTasksLoading, supabaseTasksLoading],
  ([$source, $localLoading, $supaLoading]) => 
    $source === 'local' ? $localLoading : $supaLoading
);

export const taskColumns = derived(
  [dataSource, localTaskColumns, supabaseTaskColumns],
  ([$source, $localCols, $supaCols]): UnifiedTaskColumns => {
    return $source === 'local' ? $localCols : $supaCols;
  }
);

export const taskActions = {
  async loadForProject(projectId: string | null) {
    const source = get(dataSource);
    if (source === 'local') {
      await localTaskActions.loadForProject(projectId);
    } else {
      await supabaseTaskActions.loadForProject(projectId);
    }
  },

  async create(data: UnifiedCreateTaskData) {
    const source = get(dataSource);
    if (source === 'local') {
      return await localTaskActions.create(data);
    } else {
      return await supabaseTaskActions.create(data);
    }
  },

  async update(id: string, updates: UnifiedUpdateTaskData) {
    const source = get(dataSource);
    if (source === 'local') {
      return await localTaskActions.update(id, updates);
    } else {
      return await supabaseTaskActions.update(id, updates);
    }
  },

  async delete(id: string) {
    const source = get(dataSource);
    if (source === 'local') {
      return await localTaskActions.delete(id);
    } else {
      return await supabaseTaskActions.delete(id);
    }
  },

  async move(id: string, fromStatus: TaskStatus, toStatus: TaskStatus) {
    const source = get(dataSource);
    if (source === 'local') {
      await localTaskActions.move(id, fromStatus, toStatus);
    } else {
      await supabaseTaskActions.move(id, fromStatus, toStatus);
    }
  }
};
