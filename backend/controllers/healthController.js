import { taskService } from '../services/taskService.js';

export const checkHealth = async (req, res, next) => {
  try {
    const status = await taskService.getHealthStatus(req);
    res.json(status);
  } catch (error) {
    next(error);
  }
};
