import { Link, Outlet, useOutletContext, useParams } from 'react-router'

function PostDetailLayout() {
  const { postId } = useParams()
  const {
    posts,
    repliesByPost,
    reportReasons,
    onCreateReply,
    onReport,
  } = useOutletContext()
  const post = posts.find((item) => String(item.id) === postId)

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to="/feed"
        className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-companion-muted transition hover:text-companion-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
      >
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Voltar ao feed
      </Link>
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
          onCreateReply,
          onReport,
        }}
      />
    </section>
  )
}

export default PostDetailLayout
