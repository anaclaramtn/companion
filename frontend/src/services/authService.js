import api from '../api/api.js'

// Confirmação de e-mail ainda é somente uma tela de demonstração no frontend.

function mockResponse(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 400)
  })
}

// Reenvia o link de confirmação para o e-mail informado no cadastro.
export function resendConfirmationEmail(email) {
  return mockResponse({ email })
}

// Confirma o e-mail. No sistema real, isso acontece quando a pessoa abre o
// link recebido; no protótipo, a tela de confirmação simula esse clique.
export function confirmEmail() {
  return mockResponse(null)
}

export async function login(identifier, password) {
  const response = await api.post('/auth/login', {
    identifier,
    password,
  })

  return response.data
}

export async function register(email, password) {
  const response = await api.post('/auth/register', { email, password })
  return response.data
}
