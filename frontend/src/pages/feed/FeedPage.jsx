import { useCallback } from 'react'
import { useOutletContext } from 'react-router'
import LoadMoreTrigger from '../../components/common/LoadMoreTrigger.jsx'
import PostCard from '../../components/post/PostCard.jsx'
import { usePaginatedPosts } from '../../hooks/usePaginatedPosts.js'
import { getPosts } from '../../services/postService.js'

// feedRefreshKey muda quando uma dúvida é publicada; a key nova recria o
// feed do zero, que recarrega e mostra a dúvida no topo.
function FeedPage() {
  const { feedRefreshKey } = useOutletContext()
  return <PostFeed key={feedRefreshKey} />
}

// Feed vindo do banco, 10 dúvidas por vez, das mais novas para as mais antigas.
function PostFeed() {
  const {
    reportReasons,
    onLikeChange,
    onSaveChange,
    onReport,
    currentUserId,
  } = useOutletContext()
  const fetchPage = useCallback((page) => getPosts({ page }), [])
  const {
    posts,
    totalElements,
    isLoading,
    error,
    hasMore,
    loadMore,
    retry,
  } = usePaginatedPosts(fetchPage)
  const isFirstLoad = isLoading && posts.length === 0

  return (
    <section aria-labelledby="feed-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1
          id="feed-title"
          className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Dúvidas recentes
        </h1>
        {!isFirstLoad && !error && (
          <span className="shrink-0 text-sm text-companion-muted">
            {totalElements} {totalElements === 1 ? 'dúvida' : 'dúvidas'}
          </span>
        )}
      </div>

      {isFirstLoad ? (
        <div className="grid min-h-[60vh] place-items-center text-center">
          <p role="status" className="text-lg font-semibold text-companion-muted">
            Carregando dúvidas...
          </p>
        </div>
      ) : posts.length === 0 && !error ? (
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
              onSaveChange={onSaveChange}
              onReport={onReport}
              detailsHref={`/feed/posts/${post.id}`}
            />
          ))}
        </div>
      )}

      {error ? (
        <div role="alert" className="mt-4 flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
          >
            Tentar de novo
          </button>
        </div>
      ) : (
        hasMore && posts.length > 0 && (
          <LoadMoreTrigger
            onLoadMore={loadMore}
            isLoading={isLoading}
            label="Carregar mais dúvidas"
          />
        )
      )}
    </section>
  )
}

export default FeedPage
