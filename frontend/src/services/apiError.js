export function getApiErrorMessage(error, fallback) {
  if (!error?.response) {
    return 'Não foi possível conectar à API. Confira se o backend está em execução e tente novamente.'
  }

  const { message, fieldErrors } = error.response.data ?? {}
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return Object.values(fieldErrors).join(' ')
  }
  if (message) return message

  return fallback
}

const WRONG_CREDENTIALS = 'E-mail ou senha incorretos.'
const WEAK_PASSWORD =
  'A senha deve ter 8 ou mais caracteres, com letra maiúscula, minúscula e número.'

const AUTH_ERROR_MESSAGES = {
  'auth/invalid-credential': WRONG_CREDENTIALS,
  'auth/user-not-found': WRONG_CREDENTIALS,
  'auth/wrong-password': WRONG_CREDENTIALS,
  'auth/invalid-email': 'Informe um e-mail válido.',
  'auth/email-already-in-use':
    'Já existe uma conta com esse e-mail. Entre nela ou use "Esqueceu a senha?".',
  'auth/weak-password': WEAK_PASSWORD,
  'auth/password-does-not-meet-requirements': WEAK_PASSWORD,
  'auth/user-disabled': 'Esta conta está desativada.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'auth/network-request-failed': 'Falha de conexão. Confira sua internet e tente novamente.',
  'auth/unauthorized-domain': 'Este endereço não está autorizado no Firebase.',
  'auth/operation-not-allowed': 'Este tipo de login não está ativado no Firebase.',
  'companion/email-not-verified': 'Ainda não identificamos a confirmação do seu e-mail.',
  'companion/no-pending-user': 'Entre com seu e-mail e senha para continuar.',
  'companion/firebase-not-configured': 'O login não está configurado neste ambiente.',
}

// Erros de login: os do Firebase têm um código; os demais vêm da nossa API.
export function getAuthErrorMessage(error, fallback) {
  const code = error?.code ?? ''
  if (code in AUTH_ERROR_MESSAGES) return AUTH_ERROR_MESSAGES[code]
  if (code.startsWith('auth/')) return fallback
  return getApiErrorMessage(error, fallback)
}
