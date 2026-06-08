const Spinner = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
    <span>{label}</span>
  </div>
);

export default Spinner;

