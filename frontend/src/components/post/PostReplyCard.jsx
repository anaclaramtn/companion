import { useCallback, useState } from 'react'
import DeleteReplyButton from './DeleteReplyButton.jsx'
import { usePostActions } from '../../hooks/usePostActions.js'
import ProfileLink from '../user/ProfileLink.jsx'
import ReportPopup from './ReportPopup.jsx'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function formatRelativeTime(dateValue) {
  const elapsedMinutes = Math.max(
    1,
    Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000),
  )

  if (elapsedMinutes < 60) return `há ${elapsedMinutes} min`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours}h atrás`

  return `${Math.floor(elapsedHours / 24)}d atrás`
}

// Respostas não recebem curtidas: no MVP só os posts podem ser curtidos.
function PostReplyCard({
  reply,
  onReport,
  onDelete,
  reportReasons = [],
  currentUserId = 0,
}) {
  const [isReported, setIsReported] = useState(reply.reportedByCurrentUser)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const { canModerate } = usePostActions()
  // O autor exclui a própria resposta; administração e moderação, qualquer uma.
  const canDelete = Boolean(onDelete) && (reply.ownedByCurrentUser || canModerate)
  const closeReportPopup = useCallback(() => {
    setIsReportOpen(false)
  }, [])

  // Erros sobem para o ReportPopup, que continua aberto e mostra a mensagem.
  async function submitReport(report) {
    await onReport?.({
      ...report,
      targetType: 'reply',
      targetId: reply.id,
      postId: reply.postId,
    })
    setIsReported(true)
    setIsReportOpen(false)
  }

  return (
    <>
      <article className="border-b border-companion-border/70 bg-companion-surface px-5 py-5 last:border-b-0 sm:px-6">
      <div className="flex gap-4">
        <ProfileLink
          user={reply.author}
          currentUserId={currentUserId}
          className="h-fit shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
        >
        {reply.author.avatarUrl ? (
          <img
            src={reply.author.avatarUrl}
            alt=""
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-companion-orange/10 text-xs font-bold text-companion-brand"
          >
            {initials(reply.author.name)}
          </div>
        )}
        </ProfileLink>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <ProfileLink
              user={reply.author}
              currentUserId={currentUserId}
              className="text-sm font-semibold text-companion-text hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
            >
              {reply.author.name}
            </ProfileLink>
            <span className="text-sm text-companion-muted">
              @{reply.author.username}
            </span>
            <span aria-hidden="true" className="text-companion-muted">
              ·
            </span>
            <time
              dateTime={reply.createdAt}
              className="text-xs text-companion-muted"
            >
              {formatRelativeTime(reply.createdAt)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-companion-text">
            {reply.content}
          </p>

          {/* Ninguém denuncia a própria resposta (o backend também recusa). */}
          {(!reply.ownedByCurrentUser || canDelete) && (
            <div className="mt-4 flex items-center justify-end gap-5 text-sm">
              {!reply.ownedByCurrentUser && (
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                aria-label={isReported ? 'Resposta denunciada' : 'Denunciar resposta'}
                aria-pressed={isReported}
                disabled={isReported || reportReasons.length === 0}
                className={`inline-flex items-center gap-2 transition-colors ${
                  isReported
                    ? 'cursor-default text-companion-orange'
                    : 'text-companion-muted hover:text-companion-orange'
                }`}
              >
                <i
                  className={`bi ${isReported ? 'bi-flag-fill' : 'bi-flag'}`}
                  aria-hidden="true"
                />
                <span>{isReported ? 'Denunciada' : 'Denunciar'}</span>
              </button>
              )}
              {canDelete && <DeleteReplyButton reply={reply} onDelete={onDelete} />}
            </div>
          )}
        </div>
      </div>
      </article>
      {isReportOpen && (
        <ReportPopup
          reasons={reportReasons}
          targetLabel="resposta"
          onClose={closeReportPopup}
          onSubmit={submitReport}
        />
      )}
    </>
  )
}

export default PostReplyCard
