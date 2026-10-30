import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20',
    info: 'bg-sky-600 text-white shadow-sky-500/20',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 shrink-0" />,
    info: <Info className="w-5 h-5 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium ${bgStyles[type] || bgStyles.info}`}>
        {icons[type] || icons.info}
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:opacity-80 transition ml-2">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
