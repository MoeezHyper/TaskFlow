import { useState, useCallback, useEffect } from 'react';
import type { Task, CreateTaskInput } from '@/types/task';
import { apiService } from '@/services/api';
import type { ToastState } from '@/components/common/Toast';

export const useTasks = (onCheckHealth: () => void) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchTasks = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      await onCheckHealth();
      const res = await apiService.getTasks();
      setTasks(res.tasks || []);
      if (isManual) {
        showToast('Tasks refreshed successfully', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [onCheckHealth, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const saveTask = async (input: CreateTaskInput, editingTask?: Task | null) => {
    if (editingTask) {
      const updated = await apiService.updateTask(editingTask.id, input);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showToast('Task updated successfully!');
    } else {
      const created = await apiService.createTask(input);
      setTasks((prev) => [created, ...prev]);
      showToast('Task created successfully!');
    }
  };

  const toggleComplete = async (task: Task) => {
    const updatedStatus = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: updatedStatus } : t))
    );

    try {
      await apiService.updateTask(task.id, { completed: updatedStatus });
      showToast(
        updatedStatus ? 'Task marked as completed! 🎉' : 'Task marked as active',
        'info'
      );
    } catch (err: any) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      );
      showToast('Failed to update task status', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await apiService.deleteTask(id);
      showToast('Task deleted successfully');
    } catch (err: any) {
      setTasks(prevTasks);
      showToast('Failed to delete task', 'error');
    }
  };

  return {
    tasks,
    isLoading,
    isRefreshing,
    toast,
    setToast,
    fetchTasks,
    saveTask,
    toggleComplete,
    deleteTask,
  };
};
