import { useContext } from 'react'
import { PostActionsContext } from '../contexts/postActionsContext.js'

const NO_ACTIONS = {
  canModerate: false,
  removedPostIds: new Set(),
  deletePost: null,
  deleteReply: null,
}

// Exclusão de dúvidas e respostas, fornecida pelo FeedLayout. Fora dele, nada
// pode ser excluído (os botões de excluir não aparecem).
export function usePostActions() {
  return useContext(PostActionsContext) ?? NO_ACTIONS
}
