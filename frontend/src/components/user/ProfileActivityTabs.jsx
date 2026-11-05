import { useState } from 'react'
import { Link } from 'react-router'
import PostCard from '../post/PostCard.jsx'
import ProfileLink from './ProfileLink.jsx'

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

function PostList({
  id,
  posts,
  emptyText,
  currentUserId,
  reportReasons,
  onLikeChange,
  onReport,
}) {
  return (
    <div
      id={`profile-${id}-panel`}
      role="tabpanel"
      aria-labelledby={`profile-${id}-tab`}
      className="divide-y divide-companion-border/70"
    >
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="p-4 sm:p-5">
            <PostCard
              post={post}
              currentUserId={currentUserId}
              detailsHref={`/feed/posts/${post.id}`}
              reportReasons={reportReasons}
              onLikeChange={onLikeChange}
              onReport={onReport}
            />
          </div>
        ))
      ) : (
        <p className="px-5 py-8 text-center text-sm text-companion-muted">
          {emptyText}
        </p>
      )}
    </div>
  )
}

// Abas de posts e respostas de um perfil. Com likedPosts, mostra também a aba
// "Curtidos" (usada apenas no perfil da própria conta).
function ProfileActivityTabs({
  posts,
  comments,
  likedPosts,
  postCount = posts.length,
  commentCount = comments.length,
  currentUserId,
  reportReasons,
  onLikeChange,
  onReport,
  emptyPostsText,
  emptyCommentsText,
  emptyLikedText,
}) {
  const [activeTab, setActiveTab] = useState('posts')
  const tabs = [
    { id: 'posts', label: `Posts (${postCount})` },
    { id: 'comments', label: `Respostas (${commentCount})` },
    ...(likedPosts
      ? [{ id: 'liked', label: `Curtidos (${likedPosts.length})` }]
      : []),
  ]
  const postListProps = { currentUserId, reportReasons, onLikeChange, onReport }

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
        <PostList
          id="posts"
          posts={posts}
          emptyText={emptyPostsText}
          {...postListProps}
        />
      )}
      {activeTab === 'liked' && likedPosts && (
        <PostList
          id="liked"
          posts={likedPosts}
          emptyText={emptyLikedText}
          {...postListProps}
        />
      )}
      {activeTab === 'comments' && (
        <div
          id="profile-comments-panel"
          role="tabpanel"
          aria-labelledby="profile-comments-tab"
        >
          {comments.length > 0 ? (
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
          ) : (
            <p className="px-5 py-8 text-center text-sm text-companion-muted">
              {emptyCommentsText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileActivityTabs
