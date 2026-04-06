const SkeletonCard = () => (
  <div className="animate-pulse space-y-4 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-slate-200" />
      <div className="space-y-2">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="h-3 w-20 rounded-full bg-slate-100" />
      </div>
    </div>
    <div className="h-4 w-3/4 rounded-full bg-slate-200" />
    <div className="h-3 w-full rounded-full bg-slate-100" />
    <div className="h-3 w-5/6 rounded-full bg-slate-100" />
    <div className="h-20 w-full rounded-3xl bg-slate-100" />
  </div>
);

export default SkeletonCard;
