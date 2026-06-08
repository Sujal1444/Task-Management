import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);
  const Icon = toast?.type === 'error' ? XCircle : CheckCircle2;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-md border border-line bg-white px-4 py-3 shadow-soft">
          <Icon className={toast.type === 'error' ? 'text-coral' : 'text-mint'} size={20} />
          <p className="text-sm font-medium text-ink">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

