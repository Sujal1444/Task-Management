const StatCard = ({ label, value, icon: Icon, tone = 'brand' }) => {
  const tones = {
    brand: 'bg-blue-50 text-brand',
    amber: 'bg-amber-50 text-amber',
    mint: 'bg-emerald-50 text-mint'
  };

  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-md ${tones[tone]}`}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
};

export default StatCard;

