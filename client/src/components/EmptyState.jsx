import { ClipboardList } from 'lucide-react';

const EmptyState = ({ title, message }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed border-line bg-white px-6 py-12 text-center">
    <ClipboardList className="text-slate-400" size={42} />
    <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
  </div>
);

export default EmptyState;

