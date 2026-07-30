import React from 'react';
import type { Task } from '@/types/task';
import { CheckCircle2, Clock, Flame, ListTodo } from 'lucide-react';

interface StatsBannerProps {
  tasks: Task[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <ListTodo className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Total Tasks</p>
          <p className="text-xl font-bold text-slate-100">{total}</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Completed</p>
            <p className="text-xl font-bold text-slate-100">{completed}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Pending</p>
          <p className="text-xl font-bold text-slate-100">{pending}</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">High Priority</p>
          <p className="text-xl font-bold text-slate-100">{highPriority}</p>
        </div>
      </div>
    </div>
  );
};
