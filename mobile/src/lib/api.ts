import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL
})

if (env.EXPO_PUBLIC_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise(r => setTimeout(r, Math.round(Math.random() * 4000)))
    return config
  })
}

export type PaginatedResponse<T> = {
  page: number
  hasNextPage: boolean
  data: T[]
}