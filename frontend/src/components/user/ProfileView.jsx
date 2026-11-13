import { useCallback, useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import BackLink from '../common/BackLink.jsx'
import ProfileActivityTabs from './ProfileActivityTabs.jsx'
import ProfileHeader from './ProfileHeader.jsx'
import ProfileSubjects from './ProfileSubjects.jsx'
import UserListPopup from './UserListPopup.jsx'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  followUser,
  getUserById,
  getUserFollowers,
  getUserFollowStatus,
  getUserFollowing,
  getUserSubjects,
  unfollowUser,
} from '../../services/publicProfileService.js'

// Perfil vindo do banco: cabeçalho, disciplinas, abas de atividade e listas
// de seguidores. Serve para "Meu perfil" (/perfil) e para o perfil de outros
// estudantes (/feed/users/:id); no próprio perfil aparecem "Editar perfil" e
// a aba "Curtidos" em vez do botão Seguir. Use com key={userId}.
function ProfileView({ userId }) {
  const {
    currentUserId,
    reportReasons,
    onLikePost,
    onSavePost,
    onReportItem,
    onFollowingChange,
  } = useOutletContext()
  const isOwnProfile = Number(userId) === Number(currentUserId)
  const [reloadKey, setReloadKey] = useState(0)
  const [profileRequest, setProfileRequest] = useState({
    key: null,
    data: null,
    error: '',
  })
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)
  const [followError, setFollowError] = useState('')
  const [activeRelation, setActiveRelation] = useState(null)
  const [relationReloadKey, setRelationReloadKey] = useState(0)
  const [relationRequest, setRelationRequest] = useState({
    key: null,
    users: [],
    error: '',
  })
  const relationKey = `${activeRelation}:${relationReloadKey}`

  useEffect(() => {
    let active = true
    Promise.all([
      getUserById(userId),
      getUserSubjects(userId),
      // Ninguém segue a si mesmo: no próprio perfil, os números vêm do perfil.
      isOwnProfile ? null : getUserFollowStatus(userId),
    ])
      .then(([user, subjects, followStatus]) => {
        if (!active) return
        setProfileRequest({
          key: reloadKey,
          data: {
            user,
            subjects,
            followStatus: followStatus ?? {
              followedByCurrentUser: false,
              followerCount: user.followerCount,
              followingCount: user.followingCount,
            },
          },
          error: '',
        })
      })
      .catch((error) => {
        if (!active) return
        setProfileRequest({
          key: reloadKey,
          data: null,
          // 404: conta inexistente ou excluída; 400: id inválido na URL.
          error: [400, 404].includes(error.response?.status)
            ? 'Este perfil não foi encontrado.'
            : getApiErrorMessage(error, 'Não foi possível carregar este perfil.'),
        })
      })
    return () => {
      active = false
    }
  }, [userId, isOwnProfile, reloadKey])

  useEffect(() => {
    if (!activeRelation) return undefined
    let active = true
    const loadUsers =
      activeRelation === 'followers' ? getUserFollowers : getUserFollowing
    loadUsers(userId)
      .then((page) => {
        if (active) setRelationRequest({ key: relationKey, users: page.content, error: '' })
      })
      .catch(() => {
        if (!active) return
        setRelationRequest({
          key: relationKey,
          users: [],
          error: 'Não foi possível carregar esta lista.',
        })
      })
    return () => {
      active = false
    }
  }, [userId, activeRelation, relationKey])

  const closeRelationPopup = useCallback(() => setActiveRelation(null), [])

  function openRelationPopup(relation) {
    setActiveRelation(relation)
    setRelationReloadKey((key) => key + 1)
  }

  const isLoading = profileRequest.key !== reloadKey
  const profile = isLoading ? null : profileRequest.data

  async function handleFollowToggle() {
    if (!profile || isUpdatingFollow) return
    const wasFollowing = profile.followStatus.followedByCurrentUser
    setIsUpdatingFollow(true)
    setFollowError('')
    try {
      const followStatus = wasFollowing
        ? await unfollowUser(userId)
        : await followUser(userId)
      setProfileRequest((current) => ({
        ...current,
        data: { ...current.data, followStatus },
      }))
      // Atualiza o "seguindo" da conta na lateral.
      if (followStatus.followedByCurrentUser !== wasFollowing) {
        onFollowingChange?.(followStatus.followedByCurrentUser ? 1 : -1)
      }
    } catch (error) {
      setFollowError(
        getApiErrorMessage(error, 'Não foi possível atualizar o seguimento. Tente novamente.'),
      )
    } finally {
      setIsUpdatingFollow(false)
    }
  }

  if (isLoading) {
    return (
      <div
        role="status"
        className="mx-auto max-w-4xl rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center text-sm font-semibold text-companion-muted"
      >
        Carregando perfil…
      </div>
    )
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-4xl rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
        <p role="alert" className="font-semibold text-companion-text">
          {profileRequest.error || 'Não foi possível carregar este perfil.'}
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

  const { user, subjects, followStatus } = profile
  const isRelationLoaded = relationRequest.key === relationKey

  return (
    <section
      aria-labelledby="profile-name"
      className="mx-auto max-w-4xl"
    >
      <div className="mb-4">
        <BackLink to="/feed" label="Feed" />
      </div>
      {isOwnProfile && (
        <p className="mb-3 text-xs text-companion-muted">
          É assim que outros estudantes veem o seu perfil.
        </p>
      )}

      <ProfileHeader
        titleId="profile-name"
        user={user}
        followingCount={followStatus.followingCount}
        followerCount={followStatus.followerCount}
        onOpenRelation={openRelationPopup}
        actions={
          isOwnProfile ? (
            <Link
              to="/perfil/editar"
              className="mb-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-companion-border bg-companion-panel px-5 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
            >
              <i className="bi bi-pencil" aria-hidden="true" />
              Editar perfil
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={isUpdatingFollow}
              aria-pressed={followStatus.followedByCurrentUser}
              className={`mb-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange disabled:cursor-wait disabled:opacity-60 ${
                followStatus.followedByCurrentUser
                  ? 'border border-companion-border bg-companion-panel text-companion-text hover:bg-companion-orange/5'
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
        userId={user.id}
        postCount={user.postCount}
        commentCount={user.commentCount}
        showLiked={isOwnProfile}
        postActions={{
          currentUserId,
          reportReasons,
          onLikeChange: onLikePost,
          onSaveChange: onSavePost,
          onReport: onReportItem,
        }}
        emptyPostsText={
          isOwnProfile
            ? 'Você ainda não publicou nenhuma dúvida.'
            : 'Esta pessoa ainda não publicou nenhuma dúvida.'
        }
        emptyCommentsText={
          isOwnProfile
            ? 'Você ainda não respondeu a nenhuma dúvida.'
            : 'Esta pessoa ainda não respondeu a nenhuma dúvida.'
        }
        emptyLikedText="Você ainda não curtiu nenhuma dúvida."
      />

      {activeRelation && (
        <UserListPopup
          title={activeRelation === 'followers' ? 'Seguidores' : 'Seguindo'}
          users={isRelationLoaded ? relationRequest.users : []}
          currentUserId={currentUserId}
          isLoading={!isRelationLoaded}
          error={isRelationLoaded ? relationRequest.error : ''}
          onClose={closeRelationPopup}
          onRetry={() => setRelationReloadKey((key) => key + 1)}
        />
      )}
    </section>
  )
}

export default ProfileView
