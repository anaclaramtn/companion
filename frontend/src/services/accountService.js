import api from '../api/api.js'

function mockResponse(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 400)
  })
}

// Dados privados da conta autenticada, vindos de GET /users/me.
export async function getMyAccount() {
  const { data } = await api.get('/users/me')
  return {
    email: data.email,
    enrollment: data.registrationNumber,
    role: data.role,
    status: data.status,
  }
}

// Envia ao e-mail da conta um link para criar uma nova senha.
// Retorna o e-mail usado, para a tela informar ao usuário. PROVISÓRIO: o
// envio ainda é simulado, porque o backend precisa de um servidor de e-mail
// configurado (MAIL_* no .env) para POST /api/auth/password/forgot.
export function sendPasswordResetEmail(email) {
  return mockResponse({ email })
}

// Exclui a conta: o backend anonimiza os dados pessoais e apaga a foto.
export async function deleteMyAccount() {
  await api.delete('/users/me')
}

// Matrícula: opcional, até 30 caracteres (como o backend) e única entre as
// contas. O backend guarda em maiúsculas.
export const REGISTRATION_MAX_LENGTH = 30

export function normalizeRegistrationNumber(value) {
  return value.trim().toUpperCase()
}

// Devolve a mensagem de erro da matrícula, ou '' se ela for válida (vazia
// também é válida: a matrícula é opcional).
export function getRegistrationNumberError(value) {
  const registration = normalizeRegistrationNumber(value)
  if (registration.length > REGISTRATION_MAX_LENGTH) {
    return `A matrícula deve ter no máximo ${REGISTRATION_MAX_LENGTH} caracteres.`
  }
  if (registration && !/^[A-Z0-9./-]+$/.test(registration)) {
    return 'Use só letras, números, ponto, hífen ou barra, sem espaços.'
  }
  return ''
}

// Mesmo formato que o backend guarda: sem "@" e em minúsculas.
export function normalizeUsername(username) {
  return username.trim().replace(/^@+/, '').toLowerCase()
}

// Só administradores: exclui (anonimiza) a conta de outra pessoa.
export async function deleteUserAsAdmin(userId) {
  await api.delete(`/admin/users/${userId}`)
}
