// Nomes de usuários já vistos na sessão (perfis abertos e links de perfil
// clicados). O link "Voltar" usa para mostrar "Perfil de Fulano" sem
// precisar consultar a API.
const namesById = new Map()

export function rememberUserName(user) {
  if (user?.id != null && user.name) namesById.set(String(user.id), user.name)
}

export function getRememberedUserName(userId) {
  return namesById.get(String(userId))
}
