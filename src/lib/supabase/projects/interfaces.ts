export interface Project {
  id: number;
  title: string;
  status: string;
  start_date: Date | null; 
  end_date: Date | null;
}

export interface CreateProjectData {
  title: string;
  status: string;
  start_date?: Date | null; 
  end_date?: Date | null;
}

export interface UpdateProjectData {
  title?: string;
  status?: string;
  start_date?: Date | null;
  end_date?: Date | null;
}

export interface ProjectView {
  id: number;
  title: string;
  status: string;
  start_date: Date | null;
  end_date: Date | null;
}

export interface ProjectSummary {
  id: number;
  title: string;
  status: string;
}