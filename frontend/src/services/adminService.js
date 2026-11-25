import api from '../api/api.js'

// Números do painel de administração (só ADMIN):
// { users: { total, suspended, newLast7Days, answeredAtLeastOne },
//   content: { posts, postsLast7Days, withoutReplies, replies },
//   reports: { total, pending, resolved, dismissed },
//   topSubjects: [{ code, name, postCount }] }
export async function getAdminStats() {
  const response = await api.get('/admin/stats')
  return response.data
}

export const USER_ROLES = [
  { id: 'USER', label: 'Aluno' },
  { id: 'ADMIN', label: 'Administrador' },
]

export const USER_STATUS_LABELS = {
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
  DELETED: 'Excluído',
}

// Uma página de contas, da mais nova para a mais antiga. query busca por
// e-mail, nome ou username. Cada item: { id, email, name, username,
// registrationNumber, role, status, createdAt, updatedAt, deletedAt }.
export async function listUsers({ query, page = 0, size = 20 } = {}) {
  const response = await api.get('/admin/users', {
    params: { query: query || undefined, page, size },
  })
  return response.data
}

export async function changeUserRole(userId, role) {
  const response = await api.patch(`/admin/users/${userId}/role`, { role })
  return response.data
}

// status: 'ACTIVE' (reativa) ou 'SUSPENDED'. Exclusão tem rota própria.
export async function changeUserStatus(userId, status) {
  const response = await api.patch(`/admin/users/${userId}/status`, { status })
  return response.data
}

// Anonimiza a conta (não dá para desfazer).
export async function deleteUser(userId) {
  await api.delete(`/admin/users/${userId}`)
}
