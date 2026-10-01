export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  level: TaskLevel;
  project_id: string;
}

export interface CreateTaskData {
  title: string;
  status: TaskStatus;
  level: TaskLevel;
  project_id: string;
}

export interface UpdateTaskData {
  title?: string;
  level?: TaskLevel;
  status?: TaskStatus;
}

export interface TaskView {
  id: string;
  title: string;
  status: TaskStatus;
  level: TaskLevel;
}

export type TaskColumns = Record<TaskStatus, TaskView[]>;
