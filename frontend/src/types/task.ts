export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  due_date?: string | null;
  created_at?: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  category?: string;
  due_date?: string | null;
}

export interface DatabaseStatus {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected' | 'error';
  message: string;
  supabaseConfigured?: boolean;
}
