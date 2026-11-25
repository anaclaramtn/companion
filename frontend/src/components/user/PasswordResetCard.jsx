import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getAuthErrorMessage } from '../../services/apiError.js'
import { sendPasswordReset } from '../../services/authService.js'

// Bloco "Alterar senha" de Configurações da conta e de Ajuda e suporte: envia
// ao e-mail da pessoa o link do Firebase para criar uma nova senha.
function PasswordResetCard({ id, title = 'Senha', label = 'Alterar senha' }) {
  const titleId = `${id}-title`
  const { user } = useAuth()
  const showToast = useToast()
  const [isSending, setIsSending] = useState(false)
  const [wasSent, setWasSent] = useState(false)

  async function handleSend() {
    setIsSending(true)
    try {
      await sendPasswordReset(user.email)
      setWasSent(true)
      showToast(`Enviamos o link para ${user.email}.`)
    } catch (error) {
      showToast(getAuthErrorMessage(error, 'Não foi possível enviar o e-mail. Tente novamente.'), {
        type: 'error',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <h2
        id={titleId}
        className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
      >
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-companion-text">{label}</p>
          <p className="mt-0.5 text-xs text-companion-muted">
            Enviaremos um link para {user.email} para você criar uma nova senha.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || wasSent}
          className="shrink-0 rounded-xl border border-companion-border bg-companion-panel px-4 py-2.5 text-sm font-bold text-companion-text transition hover:bg-companion-orange/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? 'Enviando…' : wasSent ? 'Link enviado' : 'Enviar link'}
        </button>
      </div>
    </section>
  )
}

export default PasswordResetCard
