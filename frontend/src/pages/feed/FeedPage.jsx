import PostCard from '../../components/post/PostCard.jsx'
import { useOutletContext } from 'react-router'

function FeedPage() {
  const { posts, reportReasons, onLikeChange, onReport, currentUserId } =
    useOutletContext()

  return (
    <section aria-labelledby="feed-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1
          id="feed-title"
          className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Dúvidas recentes
        </h1>
        <span className="shrink-0 text-sm text-companion-muted">
          {posts.length} dúvidas
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="grid min-h-[60vh] place-items-center text-center">
          <p role="status" className="text-lg font-semibold text-companion-muted">
            Não há nenhum post ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              reportReasons={reportReasons}
              onLikeChange={onLikeChange}
              onReport={onReport}
              detailsHref={`/feed/posts/${post.id}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FeedPage
