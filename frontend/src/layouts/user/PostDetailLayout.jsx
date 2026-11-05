import { Outlet, useOutletContext, useParams } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'

function PostDetailLayout() {
  const { postId } = useParams()
  const {
    posts,
    repliesByPost,
    reportReasons,
    onCreateReply,
    onLikeChange,
    onReport,
    currentUserId,
  } = useOutletContext()
  const post = posts.find((item) => String(item.id) === postId)

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-4">
        <BackLink to="/feed" label="Feed" />
      </div>
      <div className="mb-4 rounded-2xl border border-companion-border/70 bg-companion-surface px-5 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-companion-text">
          Detalhe da dúvida
        </h1>
      </div>
      <Outlet
        context={{
          post,
          replies: repliesByPost[postId] ?? [],
          reportReasons,
          currentUserId,
          onCreateReply,
          onLikeChange,
          onReport,
        }}
      />
    </section>
  )
}

export default PostDetailLayout
