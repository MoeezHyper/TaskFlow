import React from 'react';
import type { Task, Priority } from '@/types/task';
import { Check, Edit3, Trash2, Calendar, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityStyles: Record<Priority, { bg: string; text: string; border: string; label: string }> = {
  high: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    label: 'High Priority',
  },
  medium: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    label: 'Medium Priority',
  },
  low: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    label: 'Low Priority',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const priorityConfig = priorityStyles[task.priority] || priorityStyles.medium;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formattedDate = formatDate(task.due_date);

  return (
    <div
      className={`group relative glass-card p-4 rounded-2xl transition-all duration-200 ${
        task.completed ? 'opacity-70 bg-slate-900/40 border-slate-800/60' : 'hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <button
          onClick={() => onToggleComplete(task)}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/40'
              : 'border-slate-600 hover:border-indigo-400 bg-slate-800/50 text-transparent hover:text-slate-400'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
            >
              {priorityConfig.label}
            </span>

            {task.category && (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                <Tag className="w-3 h-3 text-slate-400" />
                {task.category}
              </span>
            )}
          </div>

          <h3
            className={`text-base font-semibold tracking-tight transition-all break-words ${
              task.completed ? 'line-through text-slate-400' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed font-normal">
              {task.description}
            </p>
          )}

          {formattedDate && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Due: {formattedDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 transition-all"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
