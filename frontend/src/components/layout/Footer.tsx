import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} TaskFlow App. All rights reserved.</p>
        <p className="text-slate-500 font-medium">Developed by MoeezHyper</p>
      </div>
    </footer>
  );
};

