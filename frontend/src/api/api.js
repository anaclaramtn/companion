import axios from 'axios'

let accessToken = null
let handleUnauthorized = () => {}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export function setAccessToken(token) {
  accessToken = token
}

export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = /\/auth\/(login|register)$/.test(error.config?.url ?? '')
    if (error.response?.status === 401 && !isAuthRequest) handleUnauthorized()
    return Promise.reject(error)
  },
)

export default api
