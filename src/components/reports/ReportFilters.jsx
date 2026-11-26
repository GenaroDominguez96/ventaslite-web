function ReportFilters({ value, branches, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 md:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Fecha inicial</span>
          <input
            type="date"
            value={value.date_from}
            onChange={(event) => onChange('date_from', event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Fecha final</span>
          <input
            type="date"
            min={value.date_from || undefined}
            value={value.date_to}
            onChange={(event) => onChange('date_to', event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Sucursal</span>
          <select
            value={value.branch_id}
            onChange={(event) => onChange('branch_id', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Todas las sucursales</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  )
}

export default ReportFilters
