import { useAppController } from '../../application/hooks/useAppController'
import { ActivityFormPresenter } from '../../components/ActivityFormPresenter'
import { ActivityListPresenter } from '../../components/ActivityListPresenter'

export function HomePage() {
  const {
    activities,
    topRated,
    users,
    categoryFilter,
    setCategoryFilter,
    createActivity,
    navigateTo,
  } = useAppController()

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-6">
        <ActivityListPresenter
          activities={activities}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onSelectActivity={(activityId) => navigateTo(`/activities/${activityId}`)}
        />

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="mb-4">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Ranking</p>
            <h2 className="text-2xl font-semibold text-slate-900">Top rated</h2>
          </div>

          <div className="grid gap-3">
            {topRated.map((activity) => (
              <button
                key={activity.id}
                type="button"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50"
                onClick={() => navigateTo(`/activities/${activity.id}`)}
              >
                <p className="font-semibold text-slate-900">{activity.name}</p>
                <p className="text-sm text-slate-600">
                  {activity.averageRating.toFixed(1)} puntos · {activity.ratingCount} votos
                </p>
              </button>
            ))}
            {topRated.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                Todavía no hay actividades calificadas.
              </div>
            )}
          </div>
        </section>
      </div>

      <ActivityFormPresenter
        users={users}
        initialValues={null}
        submitLabel="Crear actividad"
        onSubmit={createActivity}
        onCancel={() => undefined}
      />
    </div>
  )
}
