import { useOutletContext } from 'react-router'
import PostCard from '../../components/post/PostCard.jsx'

function SavedPage() {
  const {
    posts,
    reportReasons,
    onLikeChange,
    onSaveChange,
    onReport,
    currentUserId,
  } = useOutletContext()
  const savedPosts = posts.filter((post) => post.savedByCurrentUser)

  return (
    <section aria-labelledby="saved-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1
          id="saved-title"
          className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Salvos
        </h1>
        <span className="shrink-0 text-sm text-companion-muted">
          {savedPosts.length} {savedPosts.length === 1 ? 'dúvida salva' : 'dúvidas salvas'}
        </span>
      </div>

      {savedPosts.length === 0 ? (
        <div className="grid min-h-[60vh] place-items-center text-center">
          <p role="status" className="text-lg font-semibold text-companion-muted">
            Você ainda não salvou nenhuma dúvida.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              reportReasons={reportReasons}
              onLikeChange={onLikeChange}
              onSaveChange={onSaveChange}
              onReport={onReport}
              detailsHref={`/feed/posts/${post.id}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SavedPage
