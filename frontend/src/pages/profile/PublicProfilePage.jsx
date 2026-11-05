import { useCallback, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import ProfileActivityTabs from '../../components/user/ProfileActivityTabs.jsx'
import ProfileHeader from '../../components/user/ProfileHeader.jsx'
import ProfileSubjects from '../../components/user/ProfileSubjects.jsx'
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

function PublicProfilePage() {
  const { userId } = useParams()
  const { currentUserId, reportReasons, onLikeChange, onReport } =
    useOutletContext()
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
      <div className="mb-4">
        <BackLink to="/feed" label="Feed" />
      </div>
      <p className="mb-3 text-xs text-companion-muted">
        Perfil e publicações com dados simulados para demonstração.
      </p>

      <ProfileHeader
        titleId="public-profile-name"
        user={user}
        followingCount={followStatus.followingCount}
        followerCount={followStatus.followerCount}
        onOpenRelation={openRelationPopup}
        actions={
          !isCurrentUser && (
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
          )
        }
      >
        {followError && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {followError}
          </p>
        )}
      </ProfileHeader>

      <ProfileSubjects subjects={subjects} />

      <ProfileActivityTabs
        key={userId}
        posts={posts}
        comments={comments}
        postCount={user.postCount}
        commentCount={user.commentCount}
        currentUserId={currentUserId}
        reportReasons={reportReasons}
        onLikeChange={onLikeChange}
        onReport={onReport}
        emptyPostsText="Esta pessoa ainda não publicou nenhum post."
        emptyCommentsText="Esta pessoa ainda não respondeu a nenhum post."
      />
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

export default PublicProfilePage
