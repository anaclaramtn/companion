import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import LoadMoreTrigger from '../common/LoadMoreTrigger.jsx'
import PostCard from '../post/PostCard.jsx'
import ProfileLink from './ProfileLink.jsx'
import { usePaginatedPosts } from '../../hooks/usePaginatedPosts.js'
import { getLikedPosts, getPosts } from '../../services/postService.js'
import { getUserComments } from '../../services/publicProfileService.js'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function tabClassName(isActive) {
  return `flex-1 border-b-2 px-4 py-4 text-sm font-bold transition ${
    isActive
      ? 'border-companion-orange text-companion-brand'
      : 'border-transparent text-companion-muted hover:text-companion-text'
  }`
}

function UserAvatar({ user }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className="size-10 rounded-full object-cover"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="grid size-10 place-items-center rounded-full bg-companion-orange/10 text-xs font-bold text-companion-brand"
    >
      {initials(user.name)}
    </span>
  )
}

// Carregando, vazio, erro e "carregar mais" de uma aba paginada.
function PanelStatus({ list, emptyText, loadMoreLabel }) {
  const { items, isLoading, error, hasMore, loadMore, retry } = list

  if (isLoading && items.length === 0) {
    return (
      <p role="status" className="px-5 py-8 text-center text-sm text-companion-muted">
        Carregando...
      </p>
    )
  }
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 px-5 py-6 text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
        >
          Tentar de novo
        </button>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-companion-muted">{emptyText}</p>
    )
  }
  return hasMore ? (
    <LoadMoreTrigger onLoadMore={loadMore} isLoading={isLoading} label={loadMoreLabel} />
  ) : null
}

function PostsPanel({ id, fetchPage, emptyText, postActions }) {
  const { posts, ...list } = usePaginatedPosts(fetchPage)

  return (
    <div
      id={`profile-${id}-panel`}
      role="tabpanel"
      aria-labelledby={`profile-${id}-tab`}
    >
      <div className="divide-y divide-companion-border/70">
        {posts.map((post) => (
          <div key={post.id} className="p-4 sm:p-5">
            <PostCard
              post={post}
              detailsHref={`/feed/posts/${post.id}`}
              {...postActions}
            />
          </div>
        ))}
      </div>
      <PanelStatus
        list={{ ...list, items: posts }}
        emptyText={emptyText}
        loadMoreLabel="Carregar mais dúvidas"
      />
    </div>
  )
}

function CommentsPanel({ userId, emptyText, currentUserId }) {
  const fetchPage = useCallback((page) => getUserComments(userId, { page }), [userId])
  const { posts: comments, ...list } = usePaginatedPosts(
    fetchPage,
    'Não foi possível carregar as respostas.',
  )

  return (
    <div
      id="profile-comments-panel"
      role="tabpanel"
      aria-labelledby="profile-comments-tab"
    >
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border-b border-companion-border/60 px-5 py-5 last:border-b-0 sm:px-6"
            >
              <p className="text-xs font-semibold text-companion-muted">
                Respondeu a{' '}
                <Link
                  to={`/feed/posts/${comment.postId}`}
                  className="text-companion-brand hover:underline"
                >
                  {comment.postTitle}
                </Link>
              </p>
              <div className="mt-3 flex gap-3">
                <ProfileLink
                  user={comment.author}
                  currentUserId={currentUserId}
                  className="h-fit shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
                >
                  <UserAvatar user={comment.author} />
                </ProfileLink>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-companion-text">
                    <ProfileLink
                      user={comment.author}
                      currentUserId={currentUserId}
                      className="hover:text-companion-brand"
                    >
                      {comment.author.name}
                    </ProfileLink>{' '}
                    <span className="font-normal text-companion-muted">
                      @{comment.author.username}
                    </span>
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-companion-text">
                    {comment.content}
                  </p>
                  <time
                    dateTime={comment.createdAt}
                    className="mt-2 block text-xs text-companion-muted"
                  >
                    {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                  </time>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <PanelStatus
        list={{ ...list, items: comments }}
        emptyText={emptyText}
        loadMoreLabel="Carregar mais respostas"
      />
    </div>
  )
}

// Abas de posts e respostas de um perfil, vindas do banco. Cada aba só
// carrega quando é aberta, de 10 em 10. Com showLiked, mostra também a aba
// "Curtidos" (só no perfil da própria conta, pois a API só lista as
// curtidas de quem está logado). postActions vai para cada PostCard:
// { currentUserId, reportReasons, onLikeChange, onSaveChange, onReport }.
function ProfileActivityTabs({
  userId,
  postCount,
  commentCount,
  showLiked = false,
  postActions,
  emptyPostsText,
  emptyCommentsText,
  emptyLikedText,
}) {
  const [activeTab, setActiveTab] = useState('posts')
  const fetchUserPosts = useCallback(
    (page) => getPosts({ page, authorId: userId }),
    [userId],
  )
  const fetchLikedPosts = useCallback((page) => getLikedPosts({ page }), [])
  const tabs = [
    { id: 'posts', label: `Posts (${postCount})` },
    { id: 'comments', label: `Respostas (${commentCount})` },
    ...(showLiked ? [{ id: 'liked', label: 'Curtidos' }] : []),
  ]

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm">
      <div
        role="tablist"
        aria-label="Publicações do perfil"
        className="flex border-b border-companion-border/70"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`profile-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`profile-${tab.id}-panel`}
            onClick={() => setActiveTab(tab.id)}
            className={tabClassName(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'posts' && (
        <PostsPanel
          id="posts"
          fetchPage={fetchUserPosts}
          emptyText={emptyPostsText}
          postActions={postActions}
        />
      )}
      {activeTab === 'liked' && showLiked && (
        <PostsPanel
          id="liked"
          fetchPage={fetchLikedPosts}
          emptyText={emptyLikedText}
          postActions={postActions}
        />
      )}
      {activeTab === 'comments' && (
        <CommentsPanel
          userId={userId}
          emptyText={emptyCommentsText}
          currentUserId={postActions.currentUserId}
        />
      )}
    </div>
  )
}

export default ProfileActivityTabs
