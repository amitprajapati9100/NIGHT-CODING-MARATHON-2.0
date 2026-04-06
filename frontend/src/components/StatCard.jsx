const StatCard = ({ label, value, accent = "orange" }) => {
  const accentClasses = {
    orange: "bg-orange-100 text-orange-600",
    cyan: "bg-cyan-100 text-cyan-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
          accentClasses[accent] || accentClasses.orange
        }`}
      >
        {label}
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
};

export default StatCard;
