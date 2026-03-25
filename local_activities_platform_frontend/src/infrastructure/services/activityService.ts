import { apiClient } from '../http/apiClient'
import type { Activity, ActivityPayload } from '../../domain/models'

export async function fetchActivities(category?: string) {
  const response = await apiClient.get<Activity[]>('/activities', {
    params: category ? { category } : undefined,
  })
  return response.data
}

export async function fetchActivityById(activityId: string) {
  const response = await apiClient.get<Activity>(`/activities/${activityId}`)
  return response.data
}

export async function fetchTopRatedActivities() {
  const response = await apiClient.get<Activity[]>('/activities/top-rated')
  return response.data
}

export async function createActivityRequest(payload: ActivityPayload) {
  const response = await apiClient.post<Activity>('/activities', payload)
  return response.data
}

export async function updateActivityRequest(activityId: string, payload: ActivityPayload) {
  const response = await apiClient.put<Activity>(`/activities/${activityId}`, payload)
  return response.data
}

export async function deleteActivityRequest(activityId: string) {
  await apiClient.delete(`/activities/${activityId}`)
}
