import { useState } from 'react'
import { getApiErrorMessage } from '../../services/apiError.js'
import { REPLY_MAX_LENGTH as MAX_REPLY_LENGTH } from '../../services/postService.js'

// onSubmit(conteúdo) deve devolver uma Promise. O campo só é limpo quando
// ela termina bem; se falhar, o texto continua e a mensagem da API aparece.
function PostReplyForm({ onSubmit }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const reply = content.trim()

    if (!reply || isSubmitting) return

    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit(reply)
      setContent('')
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Não foi possível enviar sua resposta. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
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
        onChange={(event) => {
          setContent(event.target.value)
          setError('')
        }}
        placeholder="Escreva uma resposta útil e respeitosa..."
        rows={3}
        maxLength={MAX_REPLY_LENGTH}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'post-reply-error' : undefined}
        className="w-full resize-y rounded-xl border border-companion-border bg-companion-panel/80 px-4 py-3 text-sm leading-6 text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
      />
      {error && (
        <p id="post-reply-error" role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-xs text-companion-muted">
          {content.length}/{MAX_REPLY_LENGTH}
        </span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-companion-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-companion-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="bi bi-send" aria-hidden="true" />
          {isSubmitting ? 'Enviando...' : 'Responder'}
        </button>
      </div>
    </form>
  )
}

export default PostReplyForm
