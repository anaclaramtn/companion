import { useOutletContext } from 'react-router'
import PostCard from '../../components/post/PostCard.jsx'
import PostReplyCard from '../../components/post/PostReplyCard.jsx'
import PostReplyForm from '../../components/post/PostReplyForm.jsx'

function PostDetailPage() {
  const {
    post,
    replies,
    reportReasons,
    onCreateReply,
    onLikeChange,
    onSaveChange,
    onReport,
    currentUserId,
    isLoading,
    error,
  } = useOutletContext()

  if (isLoading || error) {
    return (
      <div className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
        <p
          role={error ? 'alert' : 'status'}
          className={`font-semibold ${error ? 'text-red-700' : 'text-companion-muted'}`}
        >
          {error || 'Carregando dúvida...'}
        </p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
        <p role="status" className="font-semibold text-companion-muted">
          Esta dúvida não foi encontrada.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PostCard
        key={post.id}
        post={post}
        currentUserId={currentUserId}
        reportReasons={reportReasons}
        onLikeChange={onLikeChange}
        onSaveChange={onSaveChange}
        onReport={onReport}
        detailsHref={null}
      />

      <PostReplyForm onSubmit={(content) => onCreateReply(post.id, content)} />

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
                onReport={onReport}
              />
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-companion-muted sm:px-6">
            Ainda não há respostas. Seja a primeira pessoa a ajudar.
          </p>
        )}
      </section>
    </div>
  )
}

export default PostDetailPage
