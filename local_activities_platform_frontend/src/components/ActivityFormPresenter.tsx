import { useEffect, useState } from 'react'
import type { Activity, ActivityPayload, User } from '../domain/models'

type ActivityFormPresenterProps = {
  users: User[]
  initialValues: Activity | null
  submitLabel: string
  onSubmit: (payload: ActivityPayload) => void | Promise<void>
  onCancel: () => void
}

const emptyForm: ActivityPayload = {
  name: '',
  description: '',
  location: '',
  eventDate: '',
  category: '',
  creatorId: null,
}

export function ActivityFormPresenter({
  users,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ActivityFormPresenterProps) {
  const [formValues, setFormValues] = useState<ActivityPayload>(emptyForm)

  useEffect(() => {
    if (!initialValues) {
      setFormValues(emptyForm)
      return
    }

    setFormValues({
      name: initialValues.name,
      description: initialValues.description,
      location: initialValues.location,
      eventDate: initialValues.eventDate,
      category: initialValues.category,
      creatorId: initialValues.creatorId,
    })
  }, [initialValues])

  function updateField(field: keyof ActivityPayload, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onSubmit({
      ...formValues,
      creatorId: formValues.creatorId || null,
    })

    if (!initialValues) {
      setFormValues(emptyForm)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Formulario</p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {initialValues ? 'Editar actividad' : 'Crear actividad'}
          </h2>
        </div>
        {initialValues && (
          <button
            type="button"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <InputField
          label="Nombre"
          value={formValues.name}
          onChange={(value) => updateField('name', value)}
          maxLength={120}
        />
        <TextAreaField
          label="Descripción"
          value={formValues.description}
          onChange={(value) => updateField('description', value)}
          maxLength={800}
        />
        <InputField
          label="Ubicación"
          value={formValues.location}
          onChange={(value) => updateField('location', value)}
          maxLength={150}
        />
        <InputField
          label="Fecha"
          type="date"
          value={formValues.eventDate}
          onChange={(value) => updateField('eventDate', value)}
        />
        <InputField
          label="Categoría"
          value={formValues.category}
          onChange={(value) => updateField('category', value)}
          maxLength={60}
        />
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Creador</span>
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={formValues.creatorId ?? ''}
            onChange={(event) => updateField('creatorId', event.target.value)}
          >
            <option value="">Sin creador</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          {submitLabel}
        </button>
      </form>
    </section>
  )
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  maxLength?: number
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <input
        required
        type={type}
        maxLength={maxLength}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <textarea
        required
        rows={4}
        maxLength={maxLength}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
