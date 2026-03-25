import { apiClient } from '../http/apiClient'
import type { RatingPayload, RatingResponse } from '../../domain/models'

export async function createRatingRequest(payload: RatingPayload) {
  const response = await apiClient.post<RatingResponse>('/ratings', payload)
  return response.data
}
