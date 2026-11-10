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

// Mesmo formato que o backend guarda: sem "@" e em minúsculas.
export function normalizeUsername(username) {
  return username.trim().replace(/^@+/, '').toLowerCase()
}
