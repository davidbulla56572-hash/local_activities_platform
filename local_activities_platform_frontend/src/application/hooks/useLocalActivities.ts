import { useEffect, useState } from 'react'
import type {
  Activity,
  ActivityPayload,
  AppRoute,
  RatingPayload,
  StatusState,
  User,
  UserPayload,
} from '../../domain/models'
import {
  createActivityRequest,
  deleteActivityRequest,
  fetchActivities,
  fetchActivityById,
  fetchTopRatedActivities,
  updateActivityRequest,
} from '../../infrastructure/services/activityService'
import { createRatingRequest } from '../../infrastructure/services/ratingService'
import { createUserRequest, fetchUsers } from '../../infrastructure/services/userService'

function parseRoute(pathname: string): AppRoute {
  if (pathname === '/register') {
    return { name: 'register' }
  }

  if (pathname === '/detail') {
    return { name: 'detail' }
  }

  const activityMatch = pathname.match(/^\/activities\/([^/]+)$/)
  if (activityMatch) {
    return { name: 'activity', activityId: activityMatch[1] }
  }

  return { name: 'home' }
}

function navigate(pathname: string) {
  window.history.pushState({}, '', pathname)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useLocalActivities() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location.pathname))
  const [activities, setActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [topRated, setTopRated] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [status, setStatus] = useState<StatusState>({
    tone: 'idle',
    message: 'Plataforma lista para consultar actividades locales.',
  })

  useEffect(() => {
    const handleRouteChange = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  useEffect(() => {
    void loadActivities(categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    void loadSupportData()
  }, [])

  useEffect(() => {
    setEditingActivity(null)

    if (route.name === 'activity') {
      void loadSelectedActivity(route.activityId)
      return
    }

    setSelectedActivity(null)
  }, [route])

  async function loadActivities(category: string) {
    try {
      const data = await fetchActivities(category)
      setActivities(data)
    } catch (error) {
      setStatus({
        tone: 'error',
        message: getErrorMessage(error),
      })
    }
  }

  async function loadUsers() {
    const data = await fetchUsers()
    setUsers(data)
  }

  async function loadTopRated() {
    const data = await fetchTopRatedActivities()
    setTopRated(data)
  }

  async function loadSupportData() {
    try {
      await Promise.all([loadUsers(), loadTopRated()])
    } catch (error) {
      setStatus({
        tone: 'error',
        message: getErrorMessage(error),
      })
    }
  }

  async function loadSelectedActivity(activityId: string) {
    try {
      const data = await fetchActivityById(activityId)
      setSelectedActivity(data)
    } catch (error) {
      setSelectedActivity(null)
      setStatus({
        tone: 'error',
        message: getErrorMessage(error),
      })
    }
  }

  async function refreshAll(targetActivityId?: string) {
    await Promise.all([loadActivities(categoryFilter), loadSupportData()])
    if (targetActivityId) {
      await loadSelectedActivity(targetActivityId)
    }
  }

  async function createActivity(payload: ActivityPayload) {
    setStatus({ tone: 'loading', message: 'Guardando actividad...' })
    try {
      const createdActivity = await createActivityRequest(payload)
      await refreshAll(createdActivity.id)
      navigate(`/activities/${createdActivity.id}`)
      setStatus({ tone: 'success', message: 'Actividad creada correctamente.' })
    } catch (error) {
      setStatus({ tone: 'error', message: getErrorMessage(error) })
    }
  }

  async function updateActivity(payload: ActivityPayload) {
    if (!editingActivity) {
      return
    }

    setStatus({ tone: 'loading', message: 'Actualizando actividad...' })
    try {
      const updatedActivity = await updateActivityRequest(editingActivity.id, payload)
      setEditingActivity(null)
      await refreshAll(updatedActivity.id)
      navigate(`/activities/${updatedActivity.id}`)
      setStatus({ tone: 'success', message: 'Actividad actualizada correctamente.' })
    } catch (error) {
      setStatus({ tone: 'error', message: getErrorMessage(error) })
    }
  }

  async function deleteActivity(activityId: string) {
    if (!window.confirm('Se eliminará la actividad seleccionada.')) {
      return
    }

    setStatus({ tone: 'loading', message: 'Eliminando actividad...' })
    try {
      await deleteActivityRequest(activityId)
      setSelectedActivity(null)
      setEditingActivity(null)
      await refreshAll()
      navigate('/')
      setStatus({ tone: 'success', message: 'Actividad eliminada correctamente.' })
    } catch (error) {
      setStatus({ tone: 'error', message: getErrorMessage(error) })
    }
  }

  async function registerUser(payload: UserPayload) {
    setStatus({ tone: 'loading', message: 'Registrando usuario...' })
    try {
      await createUserRequest(payload)
      await loadUsers()
      setStatus({ tone: 'success', message: 'Usuario registrado correctamente.' })
      navigate('/register')
    } catch (error) {
      setStatus({ tone: 'error', message: getErrorMessage(error) })
    }
  }

  async function createRating(payload: RatingPayload) {
    setStatus({ tone: 'loading', message: 'Guardando rating...' })
    try {
      await createRatingRequest(payload)
      await refreshAll(payload.activityId)
      navigate(`/activities/${payload.activityId}`)
      setStatus({ tone: 'success', message: 'Rating registrado correctamente.' })
    } catch (error) {
      setStatus({ tone: 'error', message: getErrorMessage(error) })
    }
  }

  return {
    route,
    status,
    activities,
    users,
    topRated,
    selectedActivity,
    editingActivity,
    categoryFilter,
    setCategoryFilter,
    setEditingActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    registerUser,
    createRating,
    navigateTo: navigate,
    cancelEdition: () => setEditingActivity(null),
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado.'
}
