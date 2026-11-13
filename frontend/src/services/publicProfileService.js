import api from '../api/api.js'
import { rememberUserName } from './userNames.js'

// Perfis de estudantes e seguidores, vindos do banco.

// Perfil público: { id, name, username, avatarUrl, bio, courseId, course,
// universityId, university, semester, postCount, commentCount,
// followerCount, followingCount, createdAt }.
export async function getUserById(userId) {
  const response = await api.get(`/users/${userId}`)
  rememberUserName(response.data)
  return response.data
}

// Busca estudantes por nome, username ou matéria que dominam. Com
// subjectId, só quem domina aquela matéria. Devolve a resposta paginada com
// { id, name, username, avatarUrl, course, dominatedSubjects: [nomes] }.
export async function searchUsers(query, { subjectId, page = 0, size = 20 } = {}) {
  const response = await api.get('/users', {
    params: { query: query || undefined, subjectId, page, size },
  })
  return response.data
}

// Disciplinas do perfil: lista de { id, subject: { id, code, name }, interestType }.
export async function getUserSubjects(userId) {
  const response = await api.get(`/users/${userId}/subjects`)
  return response.data
}

// Respostas do usuário, das mais novas para as mais antigas, 10 por página.
// Cada uma traz postId e postTitle da dúvida respondida.
export async function getUserComments(userId, { page = 0, size = 10 } = {}) {
  const response = await api.get(`/users/${userId}/comments`, { params: { page, size } })
  return response.data
}

// { userId, followedByCurrentUser, followerCount, followingCount }.
export async function getUserFollowStatus(userId) {
  const response = await api.get(`/users/${userId}/follow-status`)
  return response.data
}

// Listas de seguidores e de seguidos (resumos { id, name, username,
// avatarUrl }). A API entrega no máximo 50 por página.
export async function getUserFollowers(userId, { page = 0, size = 50 } = {}) {
  const response = await api.get(`/users/${userId}/followers`, { params: { page, size } })
  return response.data
}

export async function getUserFollowing(userId, { page = 0, size = 50 } = {}) {
  const response = await api.get(`/users/${userId}/following`, { params: { page, size } })
  return response.data
}

// Segue e devolve o novo estado. Se já seguia (409, ex.: em outra aba),
// basta ler o estado atual.
export async function followUser(userId) {
  try {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
  } catch (error) {
    if (error.response?.status !== 409) throw error
    return getUserFollowStatus(userId)
  }
}

// Deixa de seguir e devolve o novo estado (a API responde sem corpo).
export async function unfollowUser(userId) {
  await api.delete(`/users/${userId}/follow`)
  return getUserFollowStatus(userId)
}
