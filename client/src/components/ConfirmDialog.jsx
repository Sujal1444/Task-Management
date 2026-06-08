import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, loading, onCancel, onConfirm }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-red-50 text-coral">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="focus-ring rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

