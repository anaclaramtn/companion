import { useCallback } from 'react'
import { useOutletContext } from 'react-router'
import LoadMoreTrigger from '../../components/common/LoadMoreTrigger.jsx'
import PostCard from '../../components/post/PostCard.jsx'
import { usePaginatedPosts } from '../../hooks/usePaginatedPosts.js'
import { getSavedPosts } from '../../services/postService.js'

// Dúvidas salvas pela conta, vindas do banco, 10 por vez, das salvas mais
// recentemente para as mais antigas.
function SavedPage() {
  const {
    reportReasons,
    onLikePost,
    onSavePost,
    onReportItem,
    currentUserId,
  } = useOutletContext()
  const fetchPage = useCallback((page) => getSavedPosts({ page }), [])
  const {
    posts,
    totalElements,
    isLoading,
    error,
    hasMore,
    loadMore,
    retry,
    removePost,
  } = usePaginatedPosts(fetchPage)
  const isFirstLoad = isLoading && posts.length === 0

  // Tirar dos salvos também tira a dúvida desta lista, depois que a API confirmar.
  async function handleSaveChange(postId, saved) {
    await onSavePost(postId, saved)
    if (!saved) removePost(postId)
  }

  return (
    <section aria-labelledby="saved-title">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1
          id="saved-title"
          className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Salvos
        </h1>
        {!isFirstLoad && !error && (
          <span className="shrink-0 text-sm text-companion-muted">
            {totalElements} {totalElements === 1 ? 'dúvida salva' : 'dúvidas salvas'}
          </span>
        )}
      </div>

      {isFirstLoad ? (
        <div className="grid min-h-[60vh] place-items-center text-center">
          <p role="status" className="text-lg font-semibold text-companion-muted">
            Carregando dúvidas salvas...
          </p>
        </div>
      ) : posts.length === 0 && !error ? (
        <div className="grid min-h-[60vh] place-items-center text-center">
          <p role="status" className="text-lg font-semibold text-companion-muted">
            Você ainda não salvou nenhuma dúvida.
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
              onLikeChange={onLikePost}
              onSaveChange={handleSaveChange}
              onReport={onReportItem}
              detailsHref={`?duvida=${post.id}`}
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
            label="Carregar mais dúvidas salvas"
          />
        )
      )}
    </section>
  )
}

export default SavedPage
