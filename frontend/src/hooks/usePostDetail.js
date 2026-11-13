import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../services/apiError.js'
import { createReply, getPost, getPostReplies } from '../services/postService.js'

// Carrega a dúvida e as respostas do banco sempre que o id muda. Serve à janela
// de detalhe, então o link ?duvida=ID funciona direto e também depois do F5.
export function usePostDetail(postId) {
  const [detail, setDetail] = useState({
    postId,
    post: null,
    replies: [],
    isLoading: true,
    error: '',
  })

  useEffect(() => {
    let active = true
    Promise.all([getPost(postId), getPostReplies(postId)])
      .then(([post, replies]) => {
        if (active) setDetail({ postId, post, replies, isLoading: false, error: '' })
      })
      .catch((error) => {
        if (!active) return
        setDetail({
          postId,
          post: null,
          replies: [],
          isLoading: false,
          // 404 (não existe ou foi apagada) ou 400 (id inválido na URL): a
          // janela mostra o aviso "não foi encontrada".
          error: [400, 404].includes(error.response?.status)
            ? ''
            : getApiErrorMessage(error, 'Não foi possível carregar esta dúvida.'),
        })
      })
    return () => {
      active = false
    }
  }, [postId])

  // Ao trocar de dúvida, mostra "carregando" até a resposta da nova chegar.
  const isCurrent = detail.postId === postId

  // Salva a resposta e a coloca no topo da lista. Erros sobem para o
  // PostReplyForm, que mostra a mensagem e mantém o texto digitado.
  async function addReply(content) {
    const reply = await createReply(postId, content)
    setDetail((current) => ({ ...current, replies: [reply, ...current.replies] }))
  }

  function removeReply(replyId) {
    setDetail((current) => ({
      ...current,
      replies: current.replies.filter((reply) => reply.id !== replyId),
    }))
  }

  return {
    post:
      isCurrent && detail.post
        ? { ...detail.post, commentCount: detail.replies.length }
        : null,
    replies: isCurrent ? detail.replies : [],
    isLoading: !isCurrent || detail.isLoading,
    error: isCurrent ? detail.error : '',
    addReply,
    removeReply,
  }
}
