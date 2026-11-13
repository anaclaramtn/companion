import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { usePostActions } from '../../hooks/usePostActions.js'
import { usePostDetail } from '../../hooks/usePostDetail.js'
import { useRelatedPost } from '../../hooks/useRelatedPost.js'
import PostCard from './PostCard.jsx'
import PostReplyCard from './PostReplyCard.jsx'
import PostReplyForm from './PostReplyForm.jsx'
import RelatedPost from './RelatedPost.jsx'

// Janela flutuante com a dúvida, as respostas e uma dúvida relacionada. Abre por
// cima da tela atual (?duvida=ID na URL), então o feed continua ao fundo.
function PostDetailModal({
  postId,
  onClose,
  reportReasons,
  currentUserId,
  onLikePost,
  onSavePost,
  onReportItem,
}) {
  const { post, replies, isLoading, error, addReply, removeReply } = usePostDetail(postId)
  const actions = usePostActions()
  const navigate = useNavigate()
  const isPostRemoved = actions.removedPostIds.has(Number(postId))
  const { related, isLoading: isRelatedLoading } = useRelatedPost(post)
  const dialogRef = useRef(null)

  // Dúvida excluída por aqui: fecha a janela.
  useEffect(() => {
    if (isPostRemoved) onClose()
  }, [isPostRemoved, onClose])

  async function handleDeleteReply(replyId) {
    await actions.deleteReply(replyId)
    removeReply(replyId)
  }

  useEffect(() => {
    // Esc fecha a janela, a menos que haja outra janela por cima (ex.: denúncia),
    // que trata o Esc por conta própria.
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return
      const dialogs = document.querySelectorAll('[aria-modal="true"]')
      if (dialogs[dialogs.length - 1] !== dialogRef.current) return
      onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    // Trava a rolagem da página de trás e leva o foco para a janela.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-3 sm:p-5">
      <button
        type="button"
        aria-label="Fechar dúvida"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-[#21170f]/55 backdrop-blur-sm"
      />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-detail-title"
        tabIndex={-1}
        className="relative flex max-h-[88dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-companion-border/70 bg-companion-cream shadow-[0_24px_80px_rgba(33,23,15,0.28)] outline-none"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-companion-border/60 px-4 py-3 sm:px-6">
          <h1 id="post-detail-title" className="text-xl font-bold text-companion-text">
            Detalhe da dúvida
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-companion-muted transition hover:bg-companion-orange/10 hover:text-companion-brand"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {isLoading || error ? (
          <div className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
            <p
              role={error ? 'alert' : 'status'}
              className={`font-semibold ${error ? 'text-red-700' : 'text-companion-muted'}`}
            >
              {error || 'Carregando dúvida...'}
            </p>
          </div>
        ) : !post ? (
          // 404: a dúvida foi excluída (ou nunca existiu).
          <div className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
            <i className="bi bi-trash text-3xl text-companion-muted" aria-hidden="true" />
            <p role="status" className="mt-3 text-lg font-bold text-companion-text">
              Esse post foi excluído
            </p>
            <p className="mt-1 text-sm text-companion-muted">
              Ele não está mais disponível.
            </p>
            <button
              type="button"
              onClick={() => navigate('/feed', { replace: true })}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-companion-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
            >
              <i className="bi bi-house" aria-hidden="true" />
              Ir para o feed
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              reportReasons={reportReasons}
              onLikeChange={onLikePost}
              onSaveChange={onSavePost}
              onReport={onReportItem}
              detailsHref={null}
            />

            <PostReplyForm onSubmit={addReply} />

            <section
              aria-labelledby="replies-title"
              className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
            >
              <h2
                id="replies-title"
                className="border-b border-companion-border/70 px-5 py-4 text-base font-bold text-companion-text sm:px-6"
              >
                Respostas ({replies.length})
              </h2>
              {replies.length > 0 ? (
                <div>
                  {replies.map((reply) => (
                    <PostReplyCard
                      key={reply.id}
                      reply={reply}
                      currentUserId={currentUserId}
                      reportReasons={reportReasons}
                      onReport={onReportItem}
                      onDelete={handleDeleteReply}
                    />
                  ))}
                </div>
              ) : (
                <p className="px-5 py-8 text-center text-sm text-companion-muted sm:px-6">
                  Ainda não há respostas. Seja a primeira pessoa a ajudar.
                </p>
              )}
            </section>

            <RelatedPost related={related} isLoading={isRelatedLoading} />
          </div>
        )}
        </div>
      </section>
    </div>
  )
}

export default PostDetailModal
