import { useState } from 'react'
import { getApiErrorMessage } from '../../services/apiError.js'
import { REPLY_MAX_LENGTH as MAX_REPLY_LENGTH } from '../../services/postService.js'

// Começa recolhido: um convite ("Sabe responder esta dúvida?") e uma caixa de
// uma linha. Ao clicar na caixa ela cresce e aparecem o contador e o botão
// Responder. Se a pessoa sair sem escrever nada, volta a ficar recolhido.
//
// onSubmit(conteúdo) deve devolver uma Promise. O campo só é limpo quando
// ela termina bem; se falhar, o texto continua e a mensagem da API aparece.
function PostReplyForm({ onSubmit }) {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
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
      setIsExpanded(false)
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Não foi possível enviar sua resposta. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Recolhe ao perder o foco, mas só se não houver texto nem erro a mostrar.
  function handleBlur(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return
    if (!content.trim() && !error && !isSubmitting) setIsExpanded(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      className="rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
    >
      <label
        htmlFor="post-reply"
        className="mb-3 flex items-center gap-2 text-sm font-semibold text-companion-text"
      >
        <i className="bi bi-chat-dots text-base text-companion-brand" aria-hidden="true" />
        Sabe responder esta dúvida?
      </label>
      <textarea
        id="post-reply"
        value={content}
        onChange={(event) => {
          setContent(event.target.value)
          setError('')
        }}
        onFocus={() => setIsExpanded(true)}
        placeholder={
          isExpanded ? 'Escreva uma resposta útil e respeitosa...' : 'Clique aqui para responder'
        }
        rows={1}
        maxLength={MAX_REPLY_LENGTH}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'post-reply-error' : undefined}
        className={`w-full resize-none rounded-xl border border-companion-border bg-companion-panel/80 px-4 py-3 text-sm leading-6 text-companion-text outline-none transition-[height,border-color,box-shadow] duration-200 placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15 ${
          isExpanded ? 'h-32' : 'h-12 cursor-pointer overflow-hidden'
        }`}
      />
      {error && (
        <p id="post-reply-error" role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {isExpanded && (
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
      )}
    </form>
  )
}

export default PostReplyForm
