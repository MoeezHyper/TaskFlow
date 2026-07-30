import { taskService } from '../services/taskService.js';

const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

export const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getAllTasks(req);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, due_date } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Task title must be 200 characters or less' });
    }

    if (description && (typeof description !== 'string' || description.length > 2000)) {
      return res.status(400).json({ error: 'Task description must be 2000 characters or less' });
    }

    if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    if (category && (typeof category !== 'string' || category.trim().length > 50)) {
      return res.status(400).json({ error: 'Category name must be 50 characters or less' });
    }

    if (due_date && isNaN(Date.parse(due_date))) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }

    const result = await taskService.createTask(req, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, category, due_date } = req.body;

    const updates = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Task title cannot be empty' });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({ error: 'Task title must be 200 characters or less' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid description format' });
      }
      if (description.length > 2000) {
        return res.status(400).json({ error: 'Task description must be 2000 characters or less' });
      }
      updates.description = description.trim();
    }

    if (completed !== undefined) {
      updates.completed = Boolean(completed);
    }

    if (priority !== undefined) {
      if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority level' });
      }
      updates.priority = priority;
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim().length > 50) {
        return res.status(400).json({ error: 'Category name must be 50 characters or less' });
      }
      updates.category = category.trim();
    }

    if (due_date !== undefined) {
      if (due_date !== null && isNaN(Date.parse(due_date))) {
        return res.status(400).json({ error: 'Invalid due date format' });
      }
      updates.due_date = due_date;
    }

    const result = await taskService.updateTask(req, id, updates);
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const result = await taskService.deleteTask(req, id);
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

