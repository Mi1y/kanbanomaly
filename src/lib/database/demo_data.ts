import type { Project } from '../features/projects/interfaces';
import type { Task } from '../features/tasks/interfaces';

const initialProjects: Project[] = [
  { id: 1, title: "Kanbanomaly", status: "active", start_date: new Date("2025-08-02"), end_date: new Date("2026-08-15") },
  { id: 2, title: "Marketing Plan", status: "active", start_date: new Date("2025-08-05"), end_date: new Date("2027-08-20") },
  { id: 3, title: "Website Launch", status: "ended", start_date: new Date("2025-08-10"), end_date: new Date("2025-08-25") },
  { id: 4, title: "Home Renovation", status: "inactive", start_date: null, end_date: null },
  { id: 5, title: "Family Vacation", status: "ended", start_date: new Date("2026-08-15"), end_date: new Date("2026-08-22") },
  { id: 6, title: "Wedding Planning", status: "active", start_date: new Date("2025-08-18"), end_date: new Date("2027-09-05") }
];

const initialTasks: Task[] = [
  // Kanbanomaly (id: 1)
  { id: 1, title: "Design UI", status: "done", level: "high", project_id: 1 },
  { id: 2, title: "Write documentation", status: "todo", level: "low", project_id: 1 },
  { id: 3, title: "Implement feature X", status: "doing", level: "medium", project_id: 1 },
  { id: 4, title: "Deploy to production", status: "todo", level: "critical", project_id: 1 },
  { id: 5, title: "Setup Docker environment", status: "done", level: "high", project_id: 1 },
  { id: 6, title: "Create unit tests", status: "doing", level: "medium", project_id: 1 },
  { id: 7, title: "Fix mobile responsiveness", status: "todo", level: "high", project_id: 1 },

  // Marketing Plan (id: 2)
  { id: 8, title: "Analyze target audience", status: "done", level: "high", project_id: 2 },
  { id: 9, title: "Create content calendar", status: "doing", level: "medium", project_id: 2 },
  { id: 10, title: "Design social media posts", status: "todo", level: "medium", project_id: 2 },
  { id: 11, title: "Launch email campaign", status: "todo", level: "high", project_id: 2 },
  { id: 12, title: "Setup Google Analytics", status: "done", level: "low", project_id: 2 },

  // Website Launch (id: 3)
  { id: 13, title: "Domain registration", status: "done", level: "critical", project_id: 3 },
  { id: 14, title: "SSL certificate setup", status: "done", level: "high", project_id: 3 },
  { id: 15, title: "Content migration", status: "done", level: "medium", project_id: 3 },
  { id: 16, title: "SEO optimization", status: "done", level: "medium", project_id: 3 },

  // Home Renovation (id: 4)
  { id: 17, title: "Paint living room", status: "todo", level: "high", project_id: 4 },
  { id: 18, title: "Install new flooring", status: "todo", level: "medium", project_id: 4 },
  { id: 19, title: "Update kitchen cabinets", status: "todo", level: "low", project_id: 4 },
  { id: 20, title: "Bathroom renovation", status: "todo", level: "critical", project_id: 4 },

  // Family Vacation (id: 5)
  { id: 21, title: "Book flights", status: "done", level: "critical", project_id: 5 },
  { id: 22, title: "Reserve hotel", status: "done", level: "high", project_id: 5 },
  { id: 23, title: "Plan itinerary", status: "done", level: "medium", project_id: 5 },
  { id: 24, title: "Pack luggage", status: "done", level: "low", project_id: 5 },

  // Wedding Planning (id: 6)
  { id: 25, title: "Book venue", status: "done", level: "critical", project_id: 6 },
  { id: 26, title: "Send invitations", status: "doing", level: "high", project_id: 6 },
  { id: 27, title: "Choose flowers", status: "todo", level: "medium", project_id: 6 },
  { id: 28, title: "Order wedding cake", status: "todo", level: "medium", project_id: 6 },
  { id: 29, title: "Hire photographer", status: "doing", level: "high", project_id: 6 },
  { id: 30, title: "Plan honeymoon", status: "todo", level: "low", project_id: 6 }
];

let demoProjects: Project[] = [...initialProjects];
let demoTasks: Task[] = [...initialTasks];
let nextProjectId = 7;
let nextTaskId = 31;

// API projects demo
export const demoProjectApi = {
  async getAll(): Promise<Project[]> {
    return [...demoProjects];
  },

  async getById(id: number): Promise<Project | null> {
    return demoProjects.find(p => p.id === id) || null;
  },

  async create(data: Omit<Project, 'id'>): Promise<Project> {
    const project: Project = {
      ...data,
      id: nextProjectId++
    };
    demoProjects.push(project);
    return project;
  },

  async update(id: number, updates: Partial<Project>): Promise<void> {
    const index = demoProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      demoProjects[index] = { ...demoProjects[index], ...updates };
    }
  },

  async delete(id: number): Promise<void> {
    demoProjects = demoProjects.filter(p => p.id !== id);
    demoTasks = demoTasks.filter(t => t.project_id !== id);
  }
};

// API tasks demo
export const demoTaskApi = {
  async getByProject(projectId: number): Promise<Task[]> {
    return demoTasks.filter(t => t.project_id === projectId);
  },

  async create(data: Omit<Task, 'id'>): Promise<Task> {
    const task: Task = {
      ...data,
      id: nextTaskId++
    };
    demoTasks.push(task);
    return task;
  },

  async update(id: number, updates: Partial<Task>): Promise<void> {
    const index = demoTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      demoTasks[index] = { ...demoTasks[index], ...updates };
    }
  },

  async delete(id: number): Promise<void> {
    demoTasks = demoTasks.filter(t => t.id !== id);
  },

  async updatedAt(projectId: number): Promise<void> {
  }
};

// Funkcja do pobrania obecnego stanu (do debugowania)
export function getDemoState() {
  return {
    projects: [...demoProjects],
    tasks: [...demoTasks],
    nextProjectId,
    nextTaskId
  };
}