function StatCard({ title, value, icon: Icon, iconBg, iconColor }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon size={17} className={iconColor} />
          </div>
        )}
      </div>

      <p className="mt-4 text-[25px] font-bold tracking-tight text-slate-900">{value}</p>
    </article>
  )
}

export default StatCard
