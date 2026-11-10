import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import SubjectTag from '../common/SubjectTag.jsx'
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

function PostCard({
  post,
  onLikeChange,
  onSaveChange,
  onReport,
  reportReasons = [],
  detailsHref,
  currentUserId = 0,
}) {
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isSaved, setIsSaved] = useState(post.savedByCurrentUser ?? false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isReported, setIsReported] = useState(false)
  const [isLikePending, setIsLikePending] = useState(false)
  const [isSavePending, setIsSavePending] = useState(false)
  const subjects = post.subjects ?? (post.subject ? [post.subject] : [])
  const closeReportPopup = useCallback(() => {
    setIsReportOpen(false)
  }, [])

  // Curtir e salvar mudam a tela na hora. Os callbacks podem devolver uma
  // Promise (API): se ela falhar, volta ao estado anterior; enquanto não
  // termina, novos cliques no mesmo botão são ignorados.
  async function toggleLike() {
    if (isLikePending) return
    const previous = { isLiked, likeCount }
    const nextLiked = !isLiked
    setIsLiked(nextLiked)
    setLikeCount((count) => count + (nextLiked ? 1 : -1))
    setIsLikePending(true)
    try {
      const status = await onLikeChange?.(post.id, nextLiked)
      // A API devolve a contagem real, que pode ter mudado por outras pessoas.
      if (status?.likeCount != null) {
        setIsLiked(status.likedByCurrentUser)
        setLikeCount(status.likeCount)
      }
    } catch {
      setIsLiked(previous.isLiked)
      setLikeCount(previous.likeCount)
    } finally {
      setIsLikePending(false)
    }
  }

  async function toggleSaved() {
    if (isSavePending) return
    const nextSaved = !isSaved
    setIsSaved(nextSaved)
    setIsSavePending(true)
    try {
      await onSaveChange?.(post.id, nextSaved)
    } catch {
      setIsSaved(!nextSaved)
    } finally {
      setIsSavePending(false)
    }
  }

  // Erros sobem para o ReportPopup, que continua aberto e mostra a mensagem.
  async function submitReport(report) {
    await onReport?.({ ...report, targetType: 'post', targetId: post.id })
    setIsReported(true)
    setIsReportOpen(false)
  }

  return (
    <>
      <article className="rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-[0_8px_24px_rgba(69,42,18,0.06)] sm:p-6">
        <div className="flex gap-4">
        <ProfileLink
          user={post.author}
          currentUserId={currentUserId}
          className="h-fit shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
        >
        {post.author.avatarUrl ? (
          <img
            src={post.author.avatarUrl}
            alt=""
            className="size-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-companion-orange/10 text-sm font-bold text-companion-brand"
          >
            {initials(post.author.name)}
          </div>
        )}
        </ProfileLink>

        <div className="min-w-0 flex-1">
          <PostContent
            post={post}
            subjects={subjects}
            detailsHref={detailsHref}
            currentUserId={currentUserId}
          />

          <div className="mt-5 flex items-center gap-5 border-t border-companion-border/70 pt-4 text-sm text-companion-muted">
            <button
              type="button"
              onClick={toggleLike}
              aria-label={isLiked ? 'Descurtir publicação' : 'Curtir publicação'}
              aria-pressed={isLiked}
              className={`inline-flex items-center gap-2 transition-colors ${
                isLiked
                  ? 'text-companion-orange'
                  : 'text-companion-muted hover:text-companion-orange'
              }`}
            >
              <i
                className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} transition-transform duration-200 active:scale-125`}
                aria-hidden="true"
              />
              {likeCount}
            </button>
            {detailsHref ? (
              <Link
                to={detailsHref}
                aria-label={`Ver ${post.commentCount} respostas`}
                className="inline-flex items-center gap-2 transition-colors hover:text-companion-brand"
              >
                <i className="bi bi-chat" aria-hidden="true" />
                {post.commentCount}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2">
                <i className="bi bi-chat" aria-hidden="true" />
                {post.commentCount}
              </span>
            )}
            <div className="ml-auto inline-flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSaved}
                aria-label={
                  isSaved ? 'Remover publicação dos salvos' : 'Salvar publicação'
                }
                aria-pressed={isSaved}
                className={`transition-colors ${
                  isSaved
                    ? 'text-companion-orange'
                    : 'text-companion-muted hover:text-companion-orange'
                }`}
              >
                <i
                  className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} transition-transform duration-200 active:scale-125`}
                  aria-hidden="true"
                />
              </button>
              {/* Ninguém denuncia a própria dúvida (o backend também recusa). */}
              {!post.ownedByCurrentUser && (
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  aria-label={isReported ? 'Publicação denunciada' : 'Denunciar publicação'}
                  aria-pressed={isReported}
                  disabled={isReported || reportReasons.length === 0}
                  className={`transition-colors ${
                    isReported
                      ? 'cursor-default text-companion-orange'
                      : 'text-companion-muted hover:text-companion-orange'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <i
                    className={`bi ${isReported ? 'bi-flag-fill' : 'bi-flag'}`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </article>
      {isReportOpen && (
        <ReportPopup
          reasons={reportReasons}
          targetLabel="publicação"
          onClose={closeReportPopup}
          onSubmit={submitReport}
        />
      )}
    </>
  )
}

function PostContent({ post, subjects, detailsHref, currentUserId }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="text-sm font-semibold text-companion-text">
          <ProfileLink
            user={post.author}
            currentUserId={currentUserId}
            className="rounded-sm hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
          >
            {post.author.name}
          </ProfileLink>
          <span className="ml-2 font-normal text-companion-muted">
            @{post.author.username}
          </span>
        </div>
        <time
          dateTime={post.createdAt}
          className="text-xs text-companion-muted"
        >
          {formatRelativeTime(post.createdAt)}
        </time>
      </div>

      {detailsHref ? (
        <Link
          to={detailsHref}
          aria-label={`Abrir dúvida: ${post.title}`}
          className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-companion-orange"
        >
          <PostBody post={post} subjects={subjects} />
        </Link>
      ) : (
        <PostBody post={post} subjects={subjects} />
      )}
    </>
  )
}

function PostBody({ post, subjects }) {
  return (
    <>
      <h2 className="mt-2 text-lg font-bold text-companion-text">
        {post.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-companion-muted">
        {post.content}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Conteúdos">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <SubjectTag name={subject.name} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default PostCard
