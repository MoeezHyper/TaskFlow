import React, { useState, useMemo } from 'react';
import type { Task, TaskFilter } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Search, Filter, Layers, Plus, Sparkles } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenNewTaskModal: () => void;
  isLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenNewTaskModal,
  isLoading,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(search, 300);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !debouncedSearch ||
        t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(debouncedSearch.toLowerCase()));

      let matchStatus = true;
      if (filter === 'active') matchStatus = !t.completed;
      if (filter === 'completed') matchStatus = t.completed;

      let matchPriority = true;
      if (priorityFilter !== 'all') matchPriority = t.priority === priorityFilter;

      let matchCategory = true;
      if (categoryFilter !== 'all') matchCategory = t.category === categoryFilter;

      return matchSearch && matchStatus && matchPriority && matchCategory;
    });
  }, [tasks, debouncedSearch, filter, priorityFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 w-full md:w-auto justify-center">
            {(['all', 'active', 'completed'] as TaskFilter[]).map((tab) => {
              const count =
                tab === 'all'
                  ? tasks.length
                  : tab === 'active'
                  ? tasks.filter((t) => !t.completed).length
                  : tasks.filter((t) => t.completed).length;

              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === tab
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      filter === tab
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filters:
          </span>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {(priorityFilter !== 'all' || categoryFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setPriorityFilter('all');
                setCategoryFilter('all');
                setFilter('all');
              }}
              className="text-indigo-400 hover:text-indigo-300 underline font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Loading tasks from API...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 glass-panel rounded-3xl border border-slate-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            {tasks.length === 0 ? <Sparkles className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">
              {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {tasks.length === 0
                ? 'Get started by creating your first task to keep track of your work.'
                : 'Try adjusting your search query or filter options to find what you are looking for.'}
            </p>
          </div>
          {tasks.length === 0 ? (
            <button
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Create First Task
            </button>
          ) : (
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
