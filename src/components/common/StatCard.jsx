import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

function StatCard({ title, value, change, positive, icon: Icon, iconBg, iconColor }) {
  const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={17} className={iconColor} />
        </div>
      </div>

      <p className="mt-4 text-[25px] font-bold tracking-tight text-slate-900">{value}</p>

      {change && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span className={`flex items-center gap-0.5 font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>
            <ChangeIcon size={14} />
            {change}
          </span>
          <span className="text-slate-400">vs. periodo anterior</span>
        </div>
      )}
    </article>
  )
}

export default StatCard
