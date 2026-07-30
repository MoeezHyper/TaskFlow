import { getSupabaseClient } from '../config/supabase.js';

export const taskService = {
  async getHealthStatus(req) {
    const client = getSupabaseClient();
    let dbStatus = 'disconnected';
    let message = 'Supabase credentials not configured. Provide Supabase URL and Key to connect database.';

    if (client) {
      try {
        const { error } = await client.from('tasks').select('count', { count: 'exact', head: true });
        if (!error) {
          dbStatus = 'connected';
          message = 'Connected to Supabase PostgreSQL Database';
        } else {
          dbStatus = 'error';
          message = `Supabase Error: ${error.message}`;
          console.error('[Supabase Debug Error] Health check database query failed:', error.message);
        }
      } catch (e) {
        dbStatus = 'error';
        message = `Connection Error: ${e.message}`;
        console.error('[Supabase Debug Error] Health check connection exception:', e.message);
      }
    } else {
      console.error('[Supabase Debug Error] Health check failed: Supabase client is offline or not configured.');
    }

    return {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      database: dbStatus,
      message,
      supabaseConfigured: Boolean(client)
    };
  },

  async getAllTasks(req) {
    const client = getSupabaseClient();
    if (!client) {
      console.error('[Supabase Debug Error] getAllTasks failed: Supabase is offline or not configured.');
      throw new Error('Supabase is offline or not configured.');
    }

    const { data, error } = await client
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase Debug Error] getAllTasks error:', error.message);
      throw new Error(`Supabase GET Error: ${error.message}`);
    }
    return { tasks: data, source: 'supabase' };
  },

  async createTask(req, taskData) {
    const client = getSupabaseClient();
    if (!client) {
      console.error('[Supabase Debug Error] createTask failed: Supabase is offline or not configured.');
      throw new Error('Supabase is offline or not configured.');
    }

    const { title, description, priority, category, due_date } = taskData;
    const newTask = {
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      priority: priority || 'medium',
      category: category || 'General',
      due_date: due_date || null
    };

    const { data, error } = await client
      .from('tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error('[Supabase Debug Error] createTask error:', error.message);
      throw new Error(`Supabase Insert Error: ${error.message}`);
    }
    return { task: data, source: 'supabase' };
  },

  async updateTask(req, id, updates) {
    const client = getSupabaseClient();
    if (!client) {
      console.error('[Supabase Debug Error] updateTask failed: Supabase is offline or not configured.');
      throw new Error('Supabase is offline or not configured.');
    }

    const { data, error } = await client
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase Debug Error] updateTask error:', error.message);
      throw new Error(`Supabase Update Error: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return { task: data, source: 'supabase' };
  },

  async deleteTask(req, id) {
    const client = getSupabaseClient();
    if (!client) {
      console.error('[Supabase Debug Error] deleteTask failed: Supabase is offline or not configured.');
      throw new Error('Supabase is offline or not configured.');
    }

    const { error } = await client
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Supabase Debug Error] deleteTask error:', error.message);
      throw new Error(`Supabase Delete Error: ${error.message}`);
    }

    return { success: true, id, source: 'supabase' };
  }
};
