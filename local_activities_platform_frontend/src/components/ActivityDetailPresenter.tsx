import type { Activity } from '../domain/models'

type ActivityDetailPresenterProps = {
  activity: Activity | null
  onEdit: (activity: Activity) => void
  onDelete: (activityId: string) => void
}

export function ActivityDetailPresenter({
  activity,
  onEdit,
  onDelete,
}: ActivityDetailPresenterProps) {
  if (!activity) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/90 p-6 text-slate-500 shadow-sm">
        Selecciona una actividad para ver su detalle.
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Detalle</p>
          <h2 className="text-2xl font-semibold text-slate-900">{activity.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="min-w-[108px] rounded-full border border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-2 text-sm font-bold text-slate-900 transition duration-150 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-[linear-gradient(135deg,#f0f9ff_0%,#dbeafe_100%)]"
            onClick={() => onEdit(activity)}
          >
            Editar
          </button>
          <button
            type="button"
            className="min-w-[108px] rounded-full border border-rose-800 bg-[linear-gradient(135deg,#e11d48_0%,#be123c_100%)] px-4 py-2 text-sm font-bold text-white transition duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/30"
            onClick={() => onDelete(activity.id)}
          >
            Eliminar
          </button>
        </div>
      </div>

      <p className="mb-6 text-slate-600">{activity.description}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailItem label="Ubicación" value={activity.location} />
        <DetailItem label="Fecha" value={activity.eventDate} />
        <DetailItem label="Categoría" value={activity.category} />
        <DetailItem label="Creador" value={activity.creatorName ?? 'Sin creador'} />
        <DetailItem label="Promedio" value={activity.averageRating.toFixed(1)} />
        <DetailItem label="Ratings" value={String(activity.ratingCount)} />
      </div>
    </section>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  )
}
