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

export function useLocalActivities(
  route: AppRoute,
  navigateTo: (pathname: string) => void,
) {
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

  function setErrorStatus(error: unknown) {
    setStatus({
      tone: 'error',
      message: getErrorMessage(error),
    })
  }

  async function runAction(
    loadingMessage: string,
    successMessage: string,
    action: () => Promise<void>,
  ) {
    setStatus({ tone: 'loading', message: loadingMessage })
    try {
      await action()
      setStatus({ tone: 'success', message: successMessage })
    } catch (error) {
      setErrorStatus(error)
    }
  }

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
      setErrorStatus(error)
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
      setErrorStatus(error)
    }
  }

  async function loadSelectedActivity(activityId: string) {
    try {
      const data = await fetchActivityById(activityId)
      setSelectedActivity(data)
    } catch (error) {
      setSelectedActivity(null)
      setErrorStatus(error)
    }
  }

  async function refreshAll(targetActivityId?: string) {
    await Promise.all([loadActivities(categoryFilter), loadSupportData()])
    if (targetActivityId) {
      await loadSelectedActivity(targetActivityId)
    }
  }

  async function createActivity(payload: ActivityPayload) {
    await runAction(
      'Guardando actividad...',
      'Actividad creada correctamente.',
      async () => {
      const createdActivity = await createActivityRequest(payload)
      await refreshAll(createdActivity.id)
      navigateTo(`/activities/${createdActivity.id}`)
      },
    )
  }

  async function updateActivity(payload: ActivityPayload) {
    if (!editingActivity) {
      return
    }

    await runAction(
      'Actualizando actividad...',
      'Actividad actualizada correctamente.',
      async () => {
      const updatedActivity = await updateActivityRequest(editingActivity.id, payload)
      setEditingActivity(null)
      await refreshAll(updatedActivity.id)
      navigateTo(`/activities/${updatedActivity.id}`)
      },
    )
  }

  async function deleteActivity(activityId: string) {
    if (!window.confirm('Se eliminará la actividad seleccionada.')) {
      return
    }

    await runAction(
      'Eliminando actividad...',
      'Actividad eliminada correctamente.',
      async () => {
      await deleteActivityRequest(activityId)
      setSelectedActivity(null)
      setEditingActivity(null)
      await refreshAll()
      navigateTo('/')
      },
    )
  }

  async function registerUser(payload: UserPayload) {
    await runAction(
      'Registrando usuario...',
      'Usuario registrado correctamente.',
      async () => {
      await createUserRequest(payload)
      await loadUsers()
      navigateTo('/register')
      },
    )
  }

  async function createRating(payload: RatingPayload) {
    await runAction(
      'Guardando rating...',
      'Rating registrado correctamente.',
      async () => {
      await createRatingRequest(payload)
      await refreshAll(payload.activityId)
      navigateTo(`/activities/${payload.activityId}`)
      },
    )
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
    navigateTo,
    cancelEdition: () => setEditingActivity(null),
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado.'
}
