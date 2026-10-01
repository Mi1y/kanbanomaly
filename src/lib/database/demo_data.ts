import type { Project, CreateProjectData, UpdateProjectData } from '../projects/interfaces';
import type { Task, CreateTaskData, UpdateTaskData } from '../tasks/interfaces';

export interface DemoProjectRaw {
  id: string;
  title: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}

export interface DemoTaskRaw {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  level: 'low' | 'medium' | 'high' | 'critical';
  project_id: string;
}

const initialProjects: DemoProjectRaw[] = [
  { id: '1', title: "Kanbanomaly", status: "active", start_date: "2025-08-02T00:00:00.000Z", end_date: "2026-08-15T00:00:00.000Z" },
  { id: '2', title: "Marketing Plan", status: "active", start_date: "2025-08-05T00:00:00.000Z", end_date: "2027-08-20T00:00:00.000Z" },
  { id: '3', title: "Website Launch", status: "ended", start_date: "2025-08-10T00:00:00.000Z", end_date: "2025-08-25T00:00:00.000Z" },
  { id: '4', title: "Home Renovation", status: "inactive", start_date: null, end_date: null },
  { id: '5', title: "Family Vacation", status: "ended", start_date: "2026-08-15T00:00:00.000Z", end_date: "2026-08-22T00:00:00.000Z" },
  { id: '6', title: "Wedding Planning", status: "active", start_date: "2025-08-18T00:00:00.000Z", end_date: "2027-09-05T00:00:00.000Z" }
];

const initialTasks: DemoTaskRaw[] = [
  { id: '1', title: "Design UI", status: "done", level: "high", project_id: '1' },
  { id: '2', title: "Write documentation", status: "todo", level: "low", project_id: '1' },
  { id: '3', title: "Implement feature X", status: "doing", level: "medium", project_id: '1' },
  { id: '4', title: "Deploy to production", status: "todo", level: "critical", project_id: '1' },
  { id: '5', title: "Setup Docker environment", status: "done", level: "high", project_id: '1' },
  { id: '6', title: "Create unit tests", status: "doing", level: "medium", project_id: '1' },
  { id: '7', title: "Fix mobile responsiveness", status: "todo", level: "high", project_id: '1' },
  { id: '8', title: "Analyze target audience", status: "done", level: "high", project_id: '2' },
  { id: '9', title: "Create content calendar", status: "doing", level: "medium", project_id: '2' },
  { id: '10', title: "Design social media posts", status: "todo", level: "medium", project_id: '2' },
  { id: '11', title: "Launch email campaign", status: "todo", level: "high", project_id: '2' },
  { id: '12', title: "Setup Google Analytics", status: "done", level: "low", project_id: '2' },
  { id: '13', title: "Domain registration", status: "done", level: "critical", project_id: '3' },
  { id: '14', title: "SSL certificate setup", status: "done", level: "high", project_id: '3' },
  { id: '15', title: "Content migration", status: "done", level: "medium", project_id: '3' },
  { id: '16', title: "SEO optimization", status: "done", level: "medium", project_id: '3' },
  { id: '17', title: "Paint living room", status: "todo", level: "high", project_id: '4' },
  { id: '18', title: "Install new flooring", status: "todo", level: "medium", project_id: '4' },
  { id: '19', title: "Update kitchen cabinets", status: "todo", level: "low", project_id: '4' },
  { id: '20', title: "Bathroom renovation", status: "todo", level: "critical", project_id: '4' },
  { id: '21', title: "Book flights", status: "done", level: "critical", project_id: '5' },
  { id: '22', title: "Reserve hotel", status: "done", level: "high", project_id: '5' },
  { id: '23', title: "Plan itinerary", status: "done", level: "medium", project_id: '5' },
  { id: '24', title: "Pack luggage", status: "done", level: "low", project_id: '5' },
  { id: '25', title: "Book venue", status: "done", level: "critical", project_id: '6' },
  { id: '26', title: "Send invitations", status: "doing", level: "high", project_id: '6' },
  { id: '27', title: "Choose flowers", status: "todo", level: "medium", project_id: '6' },
  { id: '28', title: "Order wedding cake", status: "todo", level: "medium", project_id: '6' },
  { id: '29', title: "Hire photographer", status: "doing", level: "high", project_id: '6' },
  { id: '30', title: "Plan honeymoon", status: "todo", level: "low", project_id: '6' }
];

let demoProjects: Project[] = initialProjects.map(p => ({
  id: p.id,
  title: p.title,
  status: p.status,
  start_date: p.start_date ? new Date(p.start_date) : null,
  end_date: p.end_date ? new Date(p.end_date) : null
}));

let demoTasks: Task[] = initialTasks.map(t => ({ ...t }));

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

export const demoProjectApi = {
  async getAll(): Promise<Project[]> {
    return [...demoProjects];
  },

  async getById(id: string): Promise<Project | null> {
    return demoProjects.find(p => p.id === id) || null;
  },

  async create(data: CreateProjectData): Promise<Project> {
    const project: Project = {
      id: generateId(),
      title: data.title,
      status: data.status,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null
    };
    demoProjects.unshift(project);
    return project;
  },

  async update(id: string, updates: UpdateProjectData): Promise<void> {
    const index = demoProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      demoProjects[index] = {
        ...demoProjects[index],
        ...updates,
        start_date: updates.start_date !== undefined ? (updates.start_date ? new Date(updates.start_date) : null) : demoProjects[index].start_date,
        end_date: updates.end_date !== undefined ? (updates.end_date ? new Date(updates.end_date) : null) : demoProjects[index].end_date
      };
    }
  },

  async delete(id: string): Promise<void> {
    demoProjects = demoProjects.filter(p => p.id !== id);
    demoTasks = demoTasks.filter(t => t.project_id !== id);
  }
};

export const demoTaskApi = {
  async getByProject(projectId: string): Promise<Task[]> {
    return demoTasks.filter(t => t.project_id === projectId);
  },

  async create(data: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: generateId(),
      title: data.title,
      status: data.status,
      level: data.level,
      project_id: data.project_id
    };
    demoTasks.push(task);
    return task;
  },

  async update(id: string, updates: UpdateTaskData): Promise<void> {
    const index = demoTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      demoTasks[index] = { ...demoTasks[index], ...updates };
    }
  },

  async delete(id: string): Promise<void> {
    demoTasks = demoTasks.filter(t => t.id !== id);
  },

  async updatedAt(projectId: string): Promise<void> {
  }
};

export function resetDemoData() {
  demoProjects = initialProjects.map(p => ({
    id: p.id,
    title: p.title,
    status: p.status,
    start_date: p.start_date ? new Date(p.start_date) : null,
    end_date: p.end_date ? new Date(p.end_date) : null
  }));
  demoTasks = initialTasks.map(t => ({ ...t }));
}