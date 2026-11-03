import { useState } from 'react'

function PostReplyForm({ onSubmit }) {
  const [content, setContent] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const reply = content.trim()

    if (!reply) return

    onSubmit(reply)
    setContent('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
    >
      <label
        htmlFor="post-reply"
        className="mb-3 block text-sm font-semibold text-companion-text"
      >
        Sua resposta à dúvida
      </label>
      <textarea
        id="post-reply"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Escreva uma resposta útil e respeitosa..."
        rows={3}
        maxLength={2000}
        required
        className="w-full resize-y rounded-xl border border-companion-border bg-white/80 px-4 py-3 text-sm leading-6 text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-xs text-companion-muted">
          {content.length}/2000
        </span>
        <button
          type="submit"
          disabled={!content.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-companion-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-companion-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="bi bi-send" aria-hidden="true" />
          Responder
        </button>
      </div>
    </form>
  )
}

export default PostReplyForm
