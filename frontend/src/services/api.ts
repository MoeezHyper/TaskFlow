import type { Task, CreateTaskInput, UpdateTaskInput, DatabaseStatus } from '@/types/task';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

export const apiService = {
  async checkHealth(): Promise<DatabaseStatus> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Health check failed');
      const data = await res.json();
      if (data.database !== 'connected') {
        console.error('[API Error] Database is offline or disconnected:', data.message);
      }
      return data;
    } catch (err: any) {
      console.error('[API Error] Health check exception:', err.message || err);
      return {
        status: 'error',
        database: 'disconnected',
        message: err.message || 'Failed to reach API server',
      };
    }
  },

  async getTasks(): Promise<{ tasks: Task[]; source: 'supabase' }> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json();
        const errorMessage = err.error || 'Failed to fetch tasks';
        console.error('[API Error] getTasks failed:', errorMessage);
        throw new Error(errorMessage);
      }
      return res.json();
    } catch (err: any) {
      console.error('[API Error] getTasks network or server error:', err.message || err);
      throw err;
    }
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        const errorMessage = err.error || 'Failed to create task';
        console.error('[API Error] createTask failed:', errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      return data.task;
    } catch (err: any) {
      console.error('[API Error] createTask exception:', err.message || err);
      throw err;
    }
  },

  async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json();
        const errorMessage = err.error || 'Failed to update task';
        console.error('[API Error] updateTask failed:', errorMessage);
        throw new Error(errorMessage);
      }
      const data = await res.json();
      return data.task;
    } catch (err: any) {
      console.error('[API Error] updateTask exception:', err.message || err);
      throw err;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json();
        const errorMessage = err.error || 'Failed to delete task';
        console.error('[API Error] deleteTask failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('[API Error] deleteTask exception:', err.message || err);
      throw err;
    }
  },
};

