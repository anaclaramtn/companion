import api from '../api/api.js'

export async function getCurrentUser() {
  const response = await api.get('/users/me')
  return response.data
}

export async function updateRequiredProfile(profile) {
  const response = await api.put('/users/me/profile', profile)
  return response.data
}

export async function uploadProfileAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.put('/users/me/avatar', formData)
  return response.data
}

export async function completeOnboarding() {
  const response = await api.post('/users/me/onboarding/complete')
  return response.data
}
