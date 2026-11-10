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

// O autor apaga a própria dúvida; moderação e administração apagam qualquer uma.
export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`)
}

export async function getPost(postId) {
  const response = await api.get(`/posts/${postId}`)
  return response.data
}

// Respostas do post no formato do PostReplyCard, das mais novas para as mais
// antigas (a API devolve na ordem inversa), como a tela sempre mostrou.
export async function getPostReplies(postId) {
  const response = await api.get(`/posts/${postId}/comments`)
  return [...response.data].reverse().map((comment) => ({
    id: comment.id,
    postId: comment.postId,
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt,
    ownedByCurrentUser: comment.ownedByCurrentUser,
    // A API ainda não informa denúncias feitas pela conta.
    reportedByCurrentUser: false,
  }))
}
