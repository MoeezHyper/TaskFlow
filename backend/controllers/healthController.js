import { taskService } from '../services/taskService.js';

export const checkHealth = async (req, res, next) => {
  try {
    const status = await taskService.getHealthStatus(req);
    res.json(status);
  } catch (error) {
    res.status(200).json({
      status: 'error',
      database: 'disconnected',
      message: error.message || 'Failed to reach database',
      supabaseConfigured: false,
    });
  }
};
