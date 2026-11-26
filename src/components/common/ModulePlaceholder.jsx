import { Sparkles } from 'lucide-react'
import PageTitle from './PageTitle'

function ModulePlaceholder({ title, description, section }) {
  return (
    <div className="mx-auto max-w-[1440px]">
      <PageTitle eyebrow={section} title={title} description={description} />

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Sparkles size={22} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Este módulo está preparado para una siguiente etapa de desarrollo.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          Por ahora se muestra únicamente la estructura visual.
        </p>
      </section>
    </div>
  )
}

export default ModulePlaceholder
