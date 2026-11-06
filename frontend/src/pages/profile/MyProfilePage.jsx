import { useCallback, useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import ProfileActivityTabs from '../../components/user/ProfileActivityTabs.jsx'
import ProfileHeader from '../../components/user/ProfileHeader.jsx'
import ProfileSubjects from '../../components/user/ProfileSubjects.jsx'
import UserListPopup from '../../components/user/UserListPopup.jsx'
import {
  getUserFollowers,
  getUserFollowing,
} from '../../services/publicProfileService.js'

function MyProfilePage() {
  const {
    posts,
    repliesByPost,
    currentUser,
    currentUserId,
    currentUserSubjects,
    reportReasons,
    onLikeChange,
    onSaveChange,
    onReport,
  } = useOutletContext()
  const [activeRelation, setActiveRelation] = useState(null)
  const [relationReloadKey, setRelationReloadKey] = useState(0)
  const [relationRequest, setRelationRequest] = useState({
    key: null,
    status: 'loading',
    users: [],
    error: '',
  })
  const relationKey = `${activeRelation}:${relationReloadKey}`

  // Posts e respostas vêm do estado do layout, então o que for publicado na
  // sessão também aparece aqui.
  const myPosts = posts.filter((post) => post.author.id === currentUserId)
  const likedPosts = posts.filter((post) => post.likedByCurrentUser)
  const postTitles = new Map(posts.map((post) => [post.id, post.title]))
  const myComments = Object.values(repliesByPost)
    .flat()
    .filter((reply) => reply.author.id === currentUserId)
    .map((reply) => ({ ...reply, postTitle: postTitles.get(reply.postId) ?? '' }))

  useEffect(() => {
    if (!activeRelation) return undefined

    let isCurrent = true
    const loadUsers =
      activeRelation === 'followers' ? getUserFollowers : getUserFollowing

    loadUsers(currentUserId)
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
  }, [activeRelation, currentUserId, relationKey])

  const closeRelationPopup = useCallback(() => {
    setActiveRelation(null)
  }, [])

  function openRelationPopup(relation) {
    setActiveRelation(relation)
    setRelationReloadKey((key) => key + 1)
  }

  const isRelationLoaded = relationRequest.key === relationKey

  return (
    <section aria-labelledby="my-profile-name" className="mx-auto max-w-4xl">
      <div className="mb-4">
        <BackLink to="/feed" label="Feed" />
      </div>
      <p className="mb-3 text-xs text-companion-muted">
        É assim que outros estudantes veem o seu perfil.
      </p>

      <ProfileHeader
        titleId="my-profile-name"
        user={currentUser}
        followingCount={currentUser.followingCount}
        followerCount={currentUser.followerCount}
        onOpenRelation={openRelationPopup}
        actions={
          <Link
            to="/perfil/editar"
            className="mb-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-companion-border bg-white px-5 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
          >
            <i className="bi bi-pencil" aria-hidden="true" />
            Editar perfil
          </Link>
        }
      />

      <ProfileSubjects subjects={currentUserSubjects} />

      <ProfileActivityTabs
        posts={myPosts}
        comments={myComments}
        likedPosts={likedPosts}
        currentUserId={currentUserId}
        reportReasons={reportReasons}
        onLikeChange={onLikeChange}
        onSaveChange={onSaveChange}
        onReport={onReport}
        emptyPostsText="Você ainda não publicou nenhuma dúvida."
        emptyCommentsText="Você ainda não respondeu a nenhuma dúvida."
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

export default MyProfilePage
