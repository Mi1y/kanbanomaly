import { derived, get } from 'svelte/store';
import { dataSource } from '../features/settings/store';
import { 
  projectList as supabaseProjectList, 
  selectedProject as supabaseSelectedProject, 
  selectedProjectId as supabaseSelectedProjectId, 
  projectsLoading as supabaseProjectsLoading, 
  projectActions as supabaseProjectActions 
} from '../supabase/projects/store';
import { 
  localProjectList, 
  localSelectedProject, 
  localSelectedProjectId, 
  localProjectsLoading, 
  localProjectActions 
} from '../local/projects/store';

export interface UnifiedProjectView {
  id: string;
  title: string;
  status: string;
  start_date: Date | string | null;
  end_date: Date | string | null;
}

export interface UnifiedProjectSummary {
  id: string;
  title: string;
  status: string;
}

export interface UnifiedCreateProjectData {
  title: string;
  status: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
}

export interface UnifiedUpdateProjectData {
  title?: string;
  status?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
}

export const projectsLoading = derived(
  [dataSource, localProjectsLoading, supabaseProjectsLoading],
  ([$source, $localLoading, $supaLoading]) => 
    $source === 'local' ? $localLoading : $supaLoading
);

export const projectList = derived(
  [dataSource, localProjectList, supabaseProjectList],
  ([$source, $localList, $supaList]): UnifiedProjectSummary[] => 
    $source === 'local' ? $localList : $supaList
);

export const selectedProject = derived(
  [dataSource, localSelectedProject, supabaseSelectedProject],
  ([$source, $localSel, $supaSel]): UnifiedProjectView | null => 
    $source === 'local' ? $localSel : $supaSel
);

export const selectedProjectId = derived(
  [dataSource, localSelectedProjectId, supabaseSelectedProjectId],
  ([$source, $localId, $supaId]): string | null => 
    $source === 'local' ? $localId : $supaId
);

export const projectActions = {
  async getById(id: string): Promise<UnifiedProjectView | null> {
    const source = get(dataSource);
    if (source === 'local') {
      return await localProjectActions.getById(id);
    } else {
      return await supabaseProjectActions.getById(id);
    }
  },

  async loadAll() {
    const source = get(dataSource);
    if (source === 'local') {
      await localProjectActions.loadAll();
    } else {
      await supabaseProjectActions.loadAll();
    }
  },

  async select(id: string | null) {
    const source = get(dataSource);
    if (source === 'local') {
      await localProjectActions.select(id);
    } else {
      await supabaseProjectActions.select(id);
    }
  },

  async create(data: UnifiedCreateProjectData) {
    const source = get(dataSource);
    if (source === 'local') {
      return await localProjectActions.create({
        title: data.title,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date
      });
    } else {
      return await supabaseProjectActions.create({
        title: data.title,
        status: data.status,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null
      });
    }
  },

  async update(id: string, updates: UnifiedUpdateProjectData) {
    const source = get(dataSource);
    if (source === 'local') {
      return await localProjectActions.update(id, updates);
    } else {
      return await supabaseProjectActions.update(id, {
        title: updates.title,
        status: updates.status,
        start_date: updates.start_date ? new Date(updates.start_date) : null,
        end_date: updates.end_date ? new Date(updates.end_date) : null
      });
    }
  },

  async delete(id: string) {
    const source = get(dataSource);
    if (source === 'local') {
      return await localProjectActions.delete(id);
    } else {
      return await supabaseProjectActions.delete(id);
    }
  }
};
