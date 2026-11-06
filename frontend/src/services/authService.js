// Simula as operações de autenticação enquanto a API não está integrada.

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
