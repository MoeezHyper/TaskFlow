import React, { useState } from 'react';
import type { Task, CreateTaskInput } from '@/types/task';
import { useDatabaseStatus } from '@/hooks/useDatabaseStatus';
import { useTasks } from '@/hooks/useTasks';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/common/Toast';
import { WeatherWidget } from '@/components/common/WeatherWidget';
import { StatsBanner } from '@/components/tasks/StatsBanner';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';

export const App: React.FC = () => {
  const { checkStatus } = useDatabaseStatus();
  const {
    tasks,
    isLoading,
    isRefreshing,
    toast,
    setToast,
    fetchTasks,
    saveTask,
    toggleComplete,
    deleteTask,
  } = useTasks(checkStatus);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSave = async (input: CreateTaskInput) => {
    await saveTask(input, editingTask);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <Navbar
        onOpenNewTaskModal={handleOpenNew}
        onRefresh={() => fetchTasks(true)}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        <WeatherWidget />
        <StatsBanner tasks={tasks} />
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onEdit={handleOpenEdit}
          onDelete={deleteTask}
          onOpenNewTaskModal={handleOpenNew}
          isLoading={isLoading}
        />
      </main>

      <Footer />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        initialTask={editingTask}
        existingCategories={tasks.map((t) => t.category).filter(Boolean)}
      />
    </div>
  );
};

export default App;
