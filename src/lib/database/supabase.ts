// DEMO
import { demoProjectApi, demoTaskApi } from './demo_data';

export const isDemoMode = true; 

export const projectApi = isDemoMode ? demoProjectApi : {
  async getAll() { },
  async getById() {},
  async create() {},
  async update() {},
  async delete() {}
};

export const taskApi = isDemoMode ? demoTaskApi : {
  async getByProject() {},
  async create() {},
  async update() {},
  async delete() {},
  async updatedAt() {}
};