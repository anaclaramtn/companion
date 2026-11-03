import { useCallback, useRef, useState } from 'react'
import { ToastContext } from '../../contexts/ToastContext.js'

const TOAST_DURATION = 4000

const toneStyles = {
  success: { icon: 'bi-check-circle-fill', iconClassName: 'text-green-600' },
  error: { icon: 'bi-exclamation-circle-fill', iconClassName: 'text-red-600' },
}

// Exibe avisos temporários no canto inferior da tela. As telas disparam os
// avisos com o hook useToast.
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, { type = 'success' } = {}) => {
      nextId.current += 1
      const id = nextId.current
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismissToast(id), TOAST_DURATION)
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => {
          const tone = toneStyles[toast.type] ?? toneStyles.success
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-companion-border/70 bg-companion-surface px-4 py-3 text-sm font-semibold text-companion-text shadow-[0_16px_40px_rgba(33,23,15,0.18)]"
            >
              <i
                className={`bi ${tone.icon} text-lg ${tone.iconClassName}`}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Fechar aviso"
                className="grid size-7 shrink-0 place-items-center rounded-full text-companion-muted transition hover:bg-companion-orange/10 hover:text-companion-brand"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
