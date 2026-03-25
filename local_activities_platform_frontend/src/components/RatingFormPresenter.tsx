import { useEffect, useState } from 'react'
import type { Activity, RatingPayload, User } from '../domain/models'

type RatingFormPresenterProps = {
  activities: Activity[]
  users: User[]
  selectedActivityId: string | null
  onSubmit: (payload: RatingPayload) => void | Promise<void>
}

const emptyForm: RatingPayload = {
  activityId: '',
  userId: '',
  score: 5,
  comment: '',
}

export function RatingFormPresenter({
  activities,
  users,
  selectedActivityId,
  onSubmit,
}: RatingFormPresenterProps) {
  const [formValues, setFormValues] = useState<RatingPayload>(emptyForm)

  useEffect(() => {
    setFormValues((current) => ({
      ...current,
      activityId: selectedActivityId ?? current.activityId,
    }))
  }, [selectedActivityId])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onSubmit(formValues)
    setFormValues((current) => ({
      ...emptyForm,
      activityId: current.activityId,
    }))
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="mb-4">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Feedback</p>
        <h2 className="text-2xl font-semibold text-slate-900">Calificar actividad</h2>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <SelectField
          label="Actividad"
          value={formValues.activityId}
          onChange={(value) =>
            setFormValues((current) => ({
              ...current,
              activityId: value,
            }))
          }
          options={activities.map((activity) => ({
            value: activity.id,
            label: activity.name,
          }))}
          placeholder="Selecciona una actividad"
        />
        <SelectField
          label="Usuario"
          value={formValues.userId}
          onChange={(value) =>
            setFormValues((current) => ({
              ...current,
              userId: value,
            }))
          }
          options={users.map((user) => ({
            value: user.id,
            label: user.name,
          }))}
          placeholder="Selecciona un usuario"
        />
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Puntaje</span>
          <input
            required
            type="number"
            min={1}
            max={5}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={formValues.score}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                score: Number(event.target.value),
              }))
            }
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Comentario</span>
          <textarea
            rows={3}
            maxLength={300}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={formValues.comment ?? ''}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                comment: event.target.value,
              }))
            }
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          Guardar rating
        </button>
      </form>
    </section>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder: string
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <select
        required
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
