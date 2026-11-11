// ============================================================
// Toast Notification Container
// ============================================================
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils/helpers';
import type { Toast } from '../context/AppContext';

const icons: Record<Toast['type'], React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-emerald-600" />,
  error:   <XCircle className="w-4 h-4 text-red-600" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-600" />,
  info:    <Info className="w-4 h-4 text-blue-600" />,
};
const toastBg: Record<Toast['type'], string> = {
  success: 'bg-emerald-50 border-emerald-200',
  error:   'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info:    'bg-blue-50 border-blue-200',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useAppContext();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast: Toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto',
            toastBg[toast.type]
          )}
        >
          <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
          <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
