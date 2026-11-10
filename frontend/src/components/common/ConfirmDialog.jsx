import { useEffect, useRef } from 'react'

// Janela de confirmação para ações importantes, como excluir a conta.
// children aparece entre a descrição e os botões (ex.: um campo extra).
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'default',
  isConfirming = false,
  canConfirm = true,
  onConfirm,
  onCancel,
  children,
}) {
  const cancelButtonRef = useRef(null)
  const isDanger = tone === 'danger'

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    cancelButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onCancel}
        className="fixed inset-0 cursor-default bg-[#21170f]/55 backdrop-blur-sm"
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative w-full max-w-md rounded-3xl border border-companion-border/70 bg-companion-surface p-6 shadow-[0_24px_80px_rgba(33,23,15,0.28)]"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold text-companion-text"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm leading-relaxed text-companion-muted"
        >
          {description}
        </p>
        {children}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-companion-border bg-white px-4 py-2.5 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm || isConfirming}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-companion-orange hover:bg-companion-orange-hover'
            }`}
          >
            {isConfirming ? 'Aguarde…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
