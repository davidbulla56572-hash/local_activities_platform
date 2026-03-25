import { apiClient } from '../http/apiClient'
import type { User, UserPayload } from '../../domain/models'

export async function fetchUsers() {
  const response = await apiClient.get<User[]>('/users')
  return response.data
}

export async function createUserRequest(payload: UserPayload) {
  const response = await apiClient.post<User>('/users', payload)
  return response.data
}
