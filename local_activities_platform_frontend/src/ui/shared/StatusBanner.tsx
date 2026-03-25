import { useAppController } from '../../application/hooks/useAppController'

export function StatusBanner() {
  const { status } = useAppController()
  const tones = {
    idle: 'border-slate-300 bg-slate-50 text-slate-700',
    success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    error: 'border-rose-300 bg-rose-50 text-rose-800',
    loading: 'border-amber-300 bg-amber-50 text-amber-800',
  }

  return (
    <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm shadow-sm ${tones[status.tone]}`}>
      {status.message}
    </div>
  )
}
