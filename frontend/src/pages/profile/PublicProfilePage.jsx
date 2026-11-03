import { useCallback, useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router'
import PostCard from '../../components/post/PostCard.jsx'
import ProfileLink from '../../components/user/ProfileLink.jsx'
import UserListPopup from '../../components/user/UserListPopup.jsx'
import {
  followUser,
  getUserFollowers,
  getUserFollowing,
  getPostsByAuthorId,
  getUserById,
  getUserComments,
  getUserFollowStatus,
  getUserSubjects,
  unfollowUser,
} from '../../services/publicProfileService.js'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function PublicProfilePage() {
  const { userId } = useParams()
  const { currentUserId, reportReasons, onReport } = useOutletContext()
  const [activeTab, setActiveTab] = useState('posts')
  const [requestState, setRequestState] = useState({
    key: null,
    status: 'loading',
    data: null,
    error: '',
  })
  const [followError, setFollowError] = useState('')
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [activeRelation, setActiveRelation] = useState(null)
  const [relationReloadKey, setRelationReloadKey] = useState(0)
  const [relationRequest, setRelationRequest] = useState({
    key: null,
    status: 'loading',
    users: [],
    error: '',
  })
  const requestKey = `${userId}:${reloadKey}`
  const relationKey = `${userId}:${activeRelation}:${relationReloadKey}`

  useEffect(() => {
    let isCurrent = true

    Promise.all([
      getUserById(userId),
      getUserSubjects(userId),
      getPostsByAuthorId(userId),
      getUserComments(userId),
      getUserFollowStatus(userId),
    ])
      .then(([user, subjects, postsPage, commentsPage, followStatus]) => {
        if (!isCurrent) return
        setRequestState({
          key: requestKey,
          status: 'loaded',
          data: {
            user,
            subjects,
            posts: postsPage.content,
            comments: commentsPage.content,
            followStatus,
          },
          error: '',
        })
      })
      .catch((loadError) => {
        if (isCurrent) {
          setRequestState({
            key: requestKey,
            status: 'error',
            data: null,
            error: loadError.message || 'Não foi possível carregar este perfil.',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [userId, reloadKey, requestKey])

  useEffect(() => {
    if (!activeRelation) return undefined

    let isCurrent = true
    const loadUsers =
      activeRelation === 'followers' ? getUserFollowers : getUserFollowing

    loadUsers(userId)
      .then((response) => {
        if (!isCurrent) return
        setRelationRequest({
          key: relationKey,
          status: 'loaded',
          users: response.content,
          error: '',
        })
      })
      .catch(() => {
        if (!isCurrent) return
        setRelationRequest({
          key: relationKey,
          status: 'error',
          users: [],
          error: 'Não foi possível carregar esta lista.',
        })
      })

    return () => {
      isCurrent = false
    }
  }, [userId, activeRelation, relationReloadKey, relationKey])

  const isLoading =
    requestState.key !== requestKey || requestState.status === 'loading'
  const profileData = requestState.key === requestKey ? requestState.data : null
  const error = requestState.key === requestKey ? requestState.error : ''

  async function handleFollowToggle() {
    if (!profileData || isUpdatingFollow) return
    setIsUpdatingFollow(true)
    setFollowError('')

    try {
      if (profileData.followStatus.followedByCurrentUser) {
        await unfollowUser(profileData.user.id)
        setRequestState((current) =>
          current.key === requestKey
            ? {
                ...current,
                data: {
                  ...current.data,
                  followStatus: {
                    ...current.data.followStatus,
                    followedByCurrentUser: false,
                    followerCount: Math.max(
                      0,
                      current.data.followStatus.followerCount - 1,
                    ),
                  },
                },
              }
            : current,
        )
      } else {
        const followStatus = await followUser(profileData.user.id)
        if (followStatus) {
          setRequestState((current) =>
            current.key === requestKey
              ? { ...current, data: { ...current.data, followStatus } }
              : current,
          )
        }
      }
    } catch {
      setFollowError('Não foi possível atualizar o seguimento. Tente novamente.')
    } finally {
      setIsUpdatingFollow(false)
    }
  }

  const closeRelationPopup = useCallback(() => {
    setActiveRelation(null)
  }, [])

  function openRelationPopup(relation) {
    setActiveRelation(relation)
    setRelationReloadKey((key) => key + 1)
  }

  if (isLoading) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center text-sm font-semibold text-companion-muted"
      >
        Carregando perfil…
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <section className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
        <p role="alert" className="font-semibold text-companion-text">
          {error || 'Não foi possível carregar este perfil.'}
        </p>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="mt-4 rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
        >
          Tentar novamente
        </button>
      </section>
    )
  }

  const { user, subjects, posts, comments, followStatus } = profileData
  const isCurrentUser = Number(user.id) === Number(currentUserId)

  return (
    <section aria-labelledby="public-profile-name" className="mx-auto max-w-4xl">
      <Link
        to="/feed"
        className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-companion-muted transition hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
      >
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Voltar ao feed
      </Link>
      <p className="mb-3 text-xs text-companion-muted">
        Perfil e publicações com dados simulados para demonstração.
      </p>

      <article className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm">
        <div
          aria-hidden="true"
          className="h-32 bg-gradient-to-r from-companion-orange to-[#f26a00] sm:h-40"
        />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-14">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-24 rounded-full border-4 border-companion-surface bg-companion-surface object-cover sm:size-28"
              />
            ) : (
              <div
                aria-hidden="true"
                className="grid size-24 place-items-center rounded-full border-4 border-companion-surface bg-white text-2xl font-bold text-companion-brand sm:size-28"
              >
                {initials(user.name)}
              </div>
            )}
            {!isCurrentUser && (
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={isUpdatingFollow}
                aria-pressed={followStatus.followedByCurrentUser}
                className={`mb-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange disabled:cursor-wait disabled:opacity-60 ${
                  followStatus.followedByCurrentUser
                    ? 'border border-companion-border bg-white text-companion-text hover:bg-companion-orange/5'
                    : 'bg-companion-orange text-white hover:bg-companion-orange-hover'
                }`}
              >
                <i
                  className={`bi ${followStatus.followedByCurrentUser ? 'bi-person-check' : 'bi-person-plus'}`}
                  aria-hidden="true"
                />
                {isUpdatingFollow
                  ? 'Atualizando…'
                  : followStatus.followedByCurrentUser
                    ? 'Seguindo'
                    : 'Seguir'}
              </button>
            )}
          </div>

          <h1
            id="public-profile-name"
            className="mt-3 text-2xl font-bold tracking-tight text-companion-text"
          >
            {user.name}
          </h1>
          <p className="text-sm text-companion-muted">@{user.username}</p>
          {user.bio && (
            <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-companion-text">
              {user.bio}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-companion-muted">
            {user.course && (
              <span className="inline-flex items-center gap-2">
                <i className="bi bi-mortarboard" aria-hidden="true" />
                {user.course}
                {user.semester ? ` · ${user.semester}º semestre` : ''}
              </span>
            )}
            {user.createdAt && (
              <span className="inline-flex items-center gap-2">
                <i className="bi bi-calendar3" aria-hidden="true" />
                Desde {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          <dl className="mt-5 flex gap-6 text-sm text-companion-muted">
            <div>
              <dt className="sr-only">Seguindo</dt>
              <dd>
                <button
                  type="button"
                  onClick={() => openRelationPopup('following')}
                  aria-haspopup="dialog"
                  className="rounded-sm text-left transition hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
                >
                  <strong className="text-companion-text">
                    {followStatus.followingCount}
                  </strong>{' '}
                  seguindo
                </button>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Seguidores</dt>
              <dd>
                <button
                  type="button"
                  onClick={() => openRelationPopup('followers')}
                  aria-haspopup="dialog"
                  className="rounded-sm text-left transition hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
                >
                  <strong className="text-companion-text">
                    {followStatus.followerCount}
                  </strong>{' '}
                  seguidores
                </button>
              </dd>
            </div>
          </dl>
          {followError && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {followError}
            </p>
          )}
        </div>
      </article>

      {subjects.length > 0 && (
        <section
          aria-labelledby="profile-subjects-title"
          className="mt-4"
        >
          <h2
            id="profile-subjects-title"
            className="sr-only"
          >
            Matérias
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <SubjectGroup
              title="Tenho dificuldade"
              subjects={subjects.filter((item) => item.interestType === 'QUER_APRENDER')}
            />
            <SubjectGroup
              title="Posso ajudar"
              subjects={subjects.filter((item) => item.interestType === 'DOMINA')}
            />
          </div>
        </section>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm">
        <div role="tablist" aria-label="Publicações do perfil" className="flex border-b border-companion-border/70">
          <button
            id="profile-posts-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === 'posts'}
            aria-controls="profile-posts-panel"
            onClick={() => setActiveTab('posts')}
            className={`flex-1 border-b-2 px-4 py-4 text-sm font-bold transition ${activeTab === 'posts' ? 'border-companion-orange text-companion-brand' : 'border-transparent text-companion-muted hover:text-companion-text'}`}
          >
            Posts ({user.postCount})
          </button>
          <button
            id="profile-comments-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === 'comments'}
            aria-controls="profile-comments-panel"
            onClick={() => setActiveTab('comments')}
            className={`flex-1 border-b-2 px-4 py-4 text-sm font-bold transition ${activeTab === 'comments' ? 'border-companion-orange text-companion-brand' : 'border-transparent text-companion-muted hover:text-companion-text'}`}
          >
            Respostas ({user.commentCount})
          </button>
        </div>

        {activeTab === 'posts' ? (
          <div
            id="profile-posts-panel"
            role="tabpanel"
            aria-labelledby="profile-posts-tab"
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
                    onReport={onReport}
                  />
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-companion-muted">
                Esta pessoa ainda não publicou nenhum post.
              </p>
            )}
          </div>
        ) : (
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
                Esta pessoa ainda não respondeu a nenhum post.
              </p>
            )}
          </div>
        )}
      </div>
      {activeRelation && (
        <UserListPopup
          title={activeRelation === 'followers' ? 'Seguidores' : 'Seguindo'}
          users={relationRequest.key === relationKey ? relationRequest.users : []}
          currentUserId={currentUserId}
          isLoading={
            relationRequest.key !== relationKey ||
            relationRequest.status === 'loading'
          }
          error={relationRequest.key === relationKey ? relationRequest.error : ''}
          onClose={closeRelationPopup}
          onRetry={() => setRelationReloadKey((key) => key + 1)}
        />
      )}
    </section>
  )
}

function SubjectGroup({ title, subjects }) {
  return (
    <section className="rounded-lg bg-[#faecd8] p-4 sm:p-5">
      <h3 className="text-xs font-bold uppercase tracking-wide text-companion-brand">
        {title}
      </h3>
      {subjects.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {subjects.map((item) => (
            <li
              key={item.id}
              className="rounded-full border border-companion-orange bg-white/50 px-3 py-1 text-xs font-medium text-companion-brand"
            >
              {item.subject.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-companion-muted">
          Nenhuma matéria nesta categoria.
        </p>
      )}
    </section>
  )
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

export default PublicProfilePage
