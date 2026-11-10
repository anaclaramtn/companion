import { useEffect, useRef, useState } from 'react'
import { getApiErrorMessage } from '../../services/apiError.js'
import { REPORT_DETAILS_MAX_LENGTH as MAX_DETAILS_LENGTH } from '../../services/postService.js'

// onSubmit({ reasonId, details }) pode devolver uma Promise; se ela falhar,
// a janela continua aberta e mostra a mensagem da API.
function ReportPopup({ reasons, targetLabel = 'conteúdo', onClose, onSubmit }) {
  const [selectedReasonId, setSelectedReasonId] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const firstReasonRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    firstReasonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const selectedReason = reasons.find(
      (reason) => String(reason.id) === selectedReasonId,
    )

    if (!selectedReason) {
      setError('Selecione o motivo da denúncia.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({
        reasonId: selectedReason.id,
        details: details.trim(),
      })
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Não foi possível enviar a denúncia. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar janela de denúncia"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#21170f]/55 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-popup-title"
        className="relative my-auto w-full max-w-xl rounded-3xl border border-companion-border/70 bg-companion-surface p-5 shadow-[0_24px_80px_rgba(33,23,15,0.28)] sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-companion-brand">
              Denúncia de {targetLabel}
            </p>
            <h2
              id="report-popup-title"
              className="mt-1 text-2xl font-bold text-companion-text"
            >
              Por que você está denunciando?
            </h2>
            <p className="mt-2 text-sm text-companion-muted">
              Sua denúncia será analisada pela equipe responsável.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-10 shrink-0 place-items-center rounded-full text-companion-muted transition hover:bg-companion-orange/10 hover:text-companion-brand"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-companion-text">
              Motivo da denúncia
            </legend>
            <div className="mt-3 space-y-2">
              {reasons.map((reason, index) => (
                <label
                  key={reason.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    selectedReasonId === String(reason.id)
                      ? 'border-companion-orange bg-companion-orange/10 text-companion-text'
                      : 'border-companion-border bg-white/70 text-companion-muted hover:border-companion-orange/70'
                  }`}
                >
                  <input
                    ref={index === 0 ? firstReasonRef : null}
                    type="radio"
                    name="report-reason"
                    value={reason.id}
                    checked={selectedReasonId === String(reason.id)}
                    onChange={(event) => {
                      setSelectedReasonId(event.target.value)
                      setError('')
                    }}
                    className="size-4 accent-[#FF8500]"
                  />
                  <span className="font-medium">{reason.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="report-details"
              className="mb-2 block text-sm font-semibold text-companion-text"
            >
              Detalhes
              <span className="ml-2 font-normal text-companion-muted">
                (opcional)
              </span>
            </label>
            <textarea
              id="report-details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Conte um pouco mais sobre o motivo da denúncia..."
              rows={4}
              maxLength={MAX_DETAILS_LENGTH}
              className="w-full resize-y rounded-xl border border-companion-border bg-white/80 px-4 py-3 text-sm leading-6 text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
            />
            <p className="mt-1 text-right text-xs text-companion-muted">
              {details.length}/{MAX_DETAILS_LENGTH}
            </p>
          </div>

          <div aria-live="polite" className="min-h-5">
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-companion-border/70 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-companion-border px-5 py-3 text-sm font-semibold text-companion-muted transition hover:bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-companion-orange px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,133,0,0.22)] transition hover:bg-companion-orange-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className="bi bi-flag" aria-hidden="true" />
              {isSubmitting ? 'Enviando...' : 'Enviar denúncia'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ReportPopup
