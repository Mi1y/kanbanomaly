export interface Project {
  id: string;
  title: string;
  status: string;
  start_date: Date | string | null; 
  end_date: Date | string | null;
  updated_at?: string;
}

export interface CreateProjectData {
  title: string;
  status: string;
  start_date?: Date | string | null; 
  end_date?: Date | string | null;
}

export interface UpdateProjectData {
  title?: string;
  status?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
}

export interface ProjectView {
  id: string;
  title: string;
  status: string;
  start_date: Date | string | null;
  end_date: Date | string | null;
}

export interface ProjectSummary {
  id: string;
  title: string;
  status: string;
}

export interface ProjectFileContent extends Project {
  tasks: import('../tasks/interfaces').Task[];
}
