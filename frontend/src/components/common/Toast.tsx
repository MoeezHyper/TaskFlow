import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideUp flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-slate-700 shadow-2xl text-xs font-semibold">
      {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
      {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
      <span className="text-slate-200">{toast.message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
