export function getApiErrorMessage(error, fallback) {
  if (!error?.response) {
    return 'Não foi possível conectar à API. Confira se o backend está em execução e tente novamente.'
  }

  if (error.response.status === 401) {
    return 'E-mail/username ou senha inválidos.'
  }

  const { message, fieldErrors } = error.response.data ?? {}
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return Object.values(fieldErrors).join(' ')
  }
  if (message) return message

  return fallback
}
