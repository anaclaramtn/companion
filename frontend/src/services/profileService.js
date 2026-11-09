import api from '../api/api.js'

export async function updateRequiredProfile(profile) {
  const response = await api.put('/users/me/profile', profile)
  return response.data
}

export async function completeOnboarding() {
  const response = await api.post('/users/me/onboarding/complete')
  return response.data
}
