import type { Activity } from '../domain/models'

type ActivityListPresenterProps = {
  activities: Activity[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  onSelectActivity: (activityId: string) => void
}

export function ActivityListPresenter({
  activities,
  selectedCategory,
  onCategoryChange,
  onSelectActivity,
}: ActivityListPresenterProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Explora</p>
          <h2 className="text-2xl font-semibold text-slate-900">Actividades</h2>
        </div>
      </div>

      <label className="mb-5 flex flex-col gap-2 text-sm text-slate-700">
        <span className="font-medium text-slate-900">Filtrar por categoría</span>
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          placeholder="Ej. Cultura"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        />
      </label>

      <div className="mt-2 space-y-4">
        {activities.map((activity) => (
          <button
            key={activity.id}
            type="button"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-left transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50"
            onClick={() => onSelectActivity(activity.id)}
          >
            <p className="font-semibold text-slate-900">{activity.name}</p>
            <p className="mt-1 text-sm text-slate-600">{activity.category}</p>
            <p className="mt-1 text-sm text-slate-500">{activity.location}</p>
          </button>
        ))}

        {activities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
            No hay actividades para mostrar con ese filtro.
          </div>
        )}
      </div>
    </section>
  )
}
