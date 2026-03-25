import { useAppController } from '../../application/hooks/useAppController'
import { ActivityDetailPresenter } from '../../components/ActivityDetailPresenter'
import { ActivityFormPresenter } from '../../components/ActivityFormPresenter'
import { RatingFormPresenter } from '../../components/RatingFormPresenter'

export function ActivityDetailPage() {
  const {
    activities,
    users,
    selectedActivity,
    editingActivity,
    setEditingActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    createRating,
    cancelEdition,
  } = useAppController()

  if (!selectedActivity) {
    return (
      <div className="mx-auto w-full max-w-3xl">
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

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-6">
        <ActivityDetailPresenter
          activity={selectedActivity}
          onEdit={setEditingActivity}
          onDelete={deleteActivity}
        />

        <RatingFormPresenter
          activities={activities}
          users={users}
          selectedActivityId={selectedActivity?.id ?? null}
          onSubmit={createRating}
        />
      </div>

      {editingActivity && (
        <ActivityFormPresenter
          users={users}
          initialValues={editingActivity}
          submitLabel="Guardar cambios"
          onSubmit={updateActivity}
          onCancel={cancelEdition}
        />
      )}
    </div>
  )
}
