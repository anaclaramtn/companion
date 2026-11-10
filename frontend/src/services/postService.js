import api from '../api/api.js'

// Posts vindos do banco. O formato da API já é o usado pelo PostCard:
// { id, author, subjects: [{ id, code, name }], title, content, createdAt,
//   likeCount, commentCount, likedByCurrentUser, savedByCurrentUser,
//   ownedByCurrentUser }.

export const POSTS_PAGE_SIZE = 10

// Uma página do feed, do mais novo para o mais antigo. Filtros opcionais:
// query (texto), subjectId e authorId. Devolve { content, page, last,
// totalElements, ... }.
export async function getPosts({ page = 0, query, subjectId, authorId } = {}) {
  const response = await api.get('/posts', {
    params: { page, size: POSTS_PAGE_SIZE, query, subjectId, authorId },
  })
  return response.data
}

// Limites iguais aos do backend (PostCreateRequestDTO).
export const POST_TITLE_MAX_LENGTH = 128
export const POST_CONTENT_MAX_LENGTH = 256
export const POST_MAX_SUBJECTS = 3

export async function createPost({ title, content, subjectIds }) {
  const response = await api.post('/posts', { title, content, subjectIds })
  return response.data
}

// Curte ou descurte e devolve o estado salvo no banco: { likeCount,
// likedByCurrentUser }. Se o post já estava curtido (ex.: em outra aba), a
// API responde 409; aí basta ler o estado atual.
export async function setPostLiked(postId, liked) {
  if (liked) {
    try {
      const response = await api.post(`/posts/${postId}/likes`)
      return response.data
    } catch (error) {
      if (error.response?.status !== 409) throw error
    }
  } else {
    await api.delete(`/posts/${postId}/likes`)
  }
  const response = await api.get(`/posts/${postId}/likes`)
  return response.data
}

// Salva ou tira dos salvos. Salvar de novo (409) já é o resultado desejado.
export async function setPostSaved(postId, saved) {
  if (!saved) {
    await api.delete(`/posts/${postId}/saves`)
    return
  }
  try {
    await api.post(`/posts/${postId}/saves`)
  } catch (error) {
    if (error.response?.status !== 409) throw error
  }
}

// Dúvidas salvas pela conta, das salvas mais recentemente para as mais antigas.
export async function getSavedPosts({ page = 0 } = {}) {
  const response = await api.get('/users/me/saved-posts', {
    params: { page, size: POSTS_PAGE_SIZE },
  })
  return response.data
}

// Dúvidas curtidas pela conta, das curtidas mais recentemente para as mais antigas.
export async function getLikedPosts({ page = 0 } = {}) {
  const response = await api.get('/users/me/liked-posts', {
    params: { page, size: POSTS_PAGE_SIZE },
  })
  return response.data
}

// Motivos de denúncia: o id é o valor do enum ReportReason do backend.
export const REPORT_REASONS = [
  { id: 'SPAM', label: 'Spam' },
  { id: 'FORA_DO_TEMA', label: 'Fora do tema' },
  { id: 'CONTEUDO_INADEQUADO', label: 'Conteúdo inadequado' },
  { id: 'OUTRO', label: 'Outro' },
]
// Limite igual ao do backend (ReportCreateRequestDTO).
export const REPORT_DETAILS_MAX_LENGTH = 1024

// Denuncia uma dúvida (targetType 'post') ou uma resposta ('reply').
// Devolve { alreadyReported: true } se a conta já tinha denunciado (409).
export async function reportContent({ targetType, targetId, reason, details }) {
  try {
    await api.post('/reports', {
      postId: targetType === 'post' ? targetId : null,
      postCommentId: targetType === 'reply' ? targetId : null,
      reason,
      details: details || null,
    })
    return { alreadyReported: false }
  } catch (error) {
    if (error.response?.status === 409) return { alreadyReported: true }
    throw error
  }
}

export async function getPost(postId) {
  const response = await api.get(`/posts/${postId}`)
  return response.data
}

// Limite igual ao do backend (PostCommentCreateRequestDTO).
export const REPLY_MAX_LENGTH = 256

// Converte uma resposta da API para o formato do PostReplyCard.
function toReply(comment) {
  return {
    id: comment.id,
    postId: comment.postId,
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt,
    ownedByCurrentUser: comment.ownedByCurrentUser,
    // A API ainda não informa denúncias feitas pela conta.
    reportedByCurrentUser: false,
  }
}

// Respostas do post, das mais novas para as mais antigas (a API devolve na
// ordem inversa), como a tela sempre mostrou.
export async function getPostReplies(postId) {
  const response = await api.get(`/posts/${postId}/comments`)
  return [...response.data].reverse().map(toReply)
}

export async function createReply(postId, content) {
  const response = await api.post(`/posts/${postId}/comments`, { content })
  return toReply(response.data)
}
