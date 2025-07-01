export interface Project {
  id: number;
  title: string;
  start_date: Date | null; 
  end_date: Date | null;
}

export interface CreateProjectData {
  title: string;
  start_date?: Date | null; 
  end_date?: Date | null;
}

export interface UpdateProjectData {
  title?: string;
  start_date?: Date | null;
  end_date?: Date | null;
}

export interface ProjectView {
  id: number;
  title: string;
  start_date: Date | null;
  end_date: Date | null;
}

export interface ProjectSummary {
  id: number;
  title: string;
}