import api from '../api/api.js'

export async function getCurrentUser() {
  const response = await api.get('/users/me')
  return response.data
}

export async function updateRequiredProfile(profile) {
  const response = await api.put('/users/me/profile', profile)
  return response.data
}

// Regras da foto de perfil, iguais às do backend (CloudinaryAvatarService).
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024
export const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp'
export const AVATAR_SIZE_MESSAGE =
  'A foto deve ter no máximo 2 MB. Escolha uma imagem menor.'

// Devolve a mensagem de erro do arquivo escolhido, ou '' se ele for válido.
export function getAvatarFileError(file) {
  if (!AVATAR_ACCEPT.split(',').includes(file.type)) {
    return 'Use uma foto JPG, PNG ou WEBP.'
  }
  if (file.size > AVATAR_MAX_SIZE) return AVATAR_SIZE_MESSAGE
  return ''
}

// A API responde 413 quando o arquivo passa de 2 MB.
export function isAvatarTooLargeError(error) {
  return error?.response?.status === 413
}

export async function uploadProfileAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.put('/users/me/avatar', formData)
  return response.data
}

export async function removeProfileAvatar() {
  const response = await api.delete('/users/me/avatar')
  return response.data
}

export async function completeOnboarding() {
  const response = await api.post('/users/me/onboarding/complete')
  return response.data
}
