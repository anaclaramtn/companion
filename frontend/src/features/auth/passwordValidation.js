// Regras de senha iguais às do backend (8 a 72 caracteres, com maiúscula,
// minúscula e número). Cada função devolve a mensagem de erro, ou '' se válida.

export function validatePassword(value) {
  if (!value) return 'Informe uma senha.'
  if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (value.length > 72) return 'A senha deve ter no máximo 72 caracteres.'
  if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(value)) return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número.'
  return ''
}

export function validatePasswordConfirmation(password, confirmation) {
  if (!confirmation) return 'Confirme sua senha.'
  if (password !== confirmation) return 'As senhas não coincidem.'
  return ''
}
