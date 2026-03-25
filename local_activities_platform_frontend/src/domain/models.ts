export type User = {
  id: string
  name: string
  email: string
}

export type UserPayload = {
  name: string
  email: string
  password: string
}

export type Activity = {
  id: string
  name: string
  description: string
  location: string
  eventDate: string
  category: string
  creatorId: string | null
  creatorName: string | null
  averageRating: number
  ratingCount: number
}

export type ActivityPayload = {
  name: string
  description: string
  location: string
  eventDate: string
  category: string
  creatorId: string | null
}

export type RatingPayload = {
  activityId: string
  userId: string
  score: number
  comment: string | null
}

export type RatingResponse = {
  message: string
}

export type StatusState = {
  tone: 'idle' | 'success' | 'error' | 'loading'
  message: string
}

export type AppRoute =
  | { name: 'home' }
  | { name: 'detail' }
  | { name: 'activity'; activityId: string }
  | { name: 'register' }
