import { useEffect, useState } from 'react'
import { Outlet, useOutletContext, useParams } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import { getApiErrorMessage } from '../../services/apiError.js'
import { getPost, getPostReplies } from '../../services/postService.js'

function PostDetailLayout() {
  const { postId } = useParams()
  const {
    currentUser,
    reportReasons,
    onLikeChange,
    onSaveChange,
    onReport,
    currentUserId,
  } = useOutletContext()
  // A dúvida e as respostas vêm do banco a cada vez que o detalhe é aberto,
  // então o link funciona direto e também depois do F5.
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
          // página mostra o aviso "não foi encontrada".
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
  const isLoading = !isCurrent || detail.isLoading

  // PROVISÓRIO: a resposta ainda fica só na tela; o envio à API entra na
  // integração das respostas.
  function handleCreateReply(replyPostId, content) {
    setDetail((current) => ({
      ...current,
      replies: [
        {
          id: `local-${Date.now()}`,
          postId: replyPostId,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            avatarUrl: currentUser.avatarUrl,
          },
          content,
          createdAt: new Date().toISOString(),
          ownedByCurrentUser: true,
          reportedByCurrentUser: false,
        },
        ...current.replies,
      ],
    }))
  }

  const post = isCurrent && detail.post
    ? { ...detail.post, commentCount: detail.replies.length }
    : null

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-4">
        <BackLink to="/feed" label="Feed" />
      </div>
      <div className="mb-4 rounded-2xl border border-companion-border/70 bg-companion-surface px-5 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-companion-text">
          Detalhe da dúvida
        </h1>
      </div>
      <Outlet
        context={{
          post,
          replies: isCurrent ? detail.replies : [],
          isLoading,
          error: isCurrent ? detail.error : '',
          reportReasons,
          currentUserId,
          onCreateReply: handleCreateReply,
          onLikeChange,
          onSaveChange,
          onReport,
        }}
      />
    </section>
  )
}

export default PostDetailLayout
