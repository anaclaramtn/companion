import { usePasswordResetEmail } from '../../hooks/usePasswordResetEmail.js'

// Bloco "Alterar senha": envia o link para o e-mail da conta e mostra um toast.
// Usado em Configurações da conta e em Ajuda e suporte.
function PasswordResetCard({ id, title = 'Senha', label = 'Alterar senha' }) {
  const { sendEmail, isSending } = usePasswordResetEmail()
  const titleId = `${id}-title`

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
            Enviaremos para o e-mail da sua conta um link para criar uma nova
            senha. O link vale por 15 minutos.
          </p>
        </div>
        <button
          type="button"
          onClick={sendEmail}
          disabled={isSending}
          className="inline-flex items-center gap-2 rounded-xl bg-companion-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-companion-orange-hover disabled:cursor-wait disabled:opacity-60"
        >
          <i className="bi bi-envelope" aria-hidden="true" />
          {isSending ? 'Enviando…' : 'Enviar link por e-mail'}
        </button>
      </div>
    </section>
  )
}

export default PasswordResetCard
