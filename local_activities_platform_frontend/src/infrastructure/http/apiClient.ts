import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4141/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const message =
      data?.message ??
      (data ? Object.values(data)[0] : null) ??
      'No fue posible completar la solicitud.'

    return Promise.reject(new Error(String(message)))
  },
)
