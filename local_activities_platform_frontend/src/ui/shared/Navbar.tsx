import { NavLink } from 'react-router-dom'
import { useAppController } from '../../application/hooks/useAppController'

export function Navbar() {
  const { route } = useAppController()

  const links = [
    { label: 'Inicio', path: '/' },
    {
      label: 'Detalle',
      path: route.name === 'activity' ? `/activities/${route.activityId}` : '/detail',
      keepActiveOnActivity: true,
    },
    { label: 'Registro', path: '/register' },
  ]

  return (
    <header className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#172554_70%,#0c4a6e_100%)] px-6 py-7 text-white shadow-xl shadow-slate-900/20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Proyecto Web 1</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Plataforma de Actividades Locales
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Organiza tus actividades según el creador y evalúa estadísticas alrededor de ellas.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => {
                const active = isActive || (link.keepActiveOnActivity && route.name === 'activity')
                return `rounded-full border px-4 py-2 text-sm font-semibold transition duration-150 hover:-translate-y-0.5 ${
                  active
                    ? 'border-sky-300 bg-sky-300 text-slate-950'
                    : 'border-slate-700 bg-slate-800 text-white hover:border-slate-500 hover:bg-slate-700'
                }`
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
