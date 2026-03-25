import { useState } from 'react'
import type { User, UserPayload } from '../domain/models'

type UserRegistrationPresenterProps = {
  users: User[]
  onSubmit: (payload: UserPayload) => void | Promise<void>
}

const emptyForm: UserPayload = {
  name: '',
  email: '',
  password: '',
}

export function UserRegistrationPresenter({
  users,
  onSubmit,
}: UserRegistrationPresenterProps) {
  const [formValues, setFormValues] = useState<UserPayload>(emptyForm)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onSubmit(formValues)
    setFormValues(emptyForm)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="mb-4">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Usuarios</p>
          <h2 className="text-2xl font-semibold text-slate-900">Registro</h2>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <InputField
            label="Nombre"
            value={formValues.name}
            onChange={(value) =>
              setFormValues((current) => ({
                ...current,
                name: value,
              }))
            }
            type="text"
          />
          <InputField
            label="Correo"
            value={formValues.email}
            onChange={(value) =>
              setFormValues((current) => ({
                ...current,
                email: value,
              }))
            }
            type="email"
          />
          <InputField
            label="Contraseña"
            value={formValues.password}
            onChange={(value) =>
              setFormValues((current) => ({
                ...current,
                password: value,
              }))
            }
            type="password"
          />
          <button
            type="submit"
            className="rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            Crear usuario
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="mb-4">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Comunidad</p>
          <h2 className="text-2xl font-semibold text-slate-900">Usuarios registrados</h2>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          ))}
          {users.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
              No hay usuarios registrados todavía.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  type,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type: string
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <input
        required
        type={type}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
