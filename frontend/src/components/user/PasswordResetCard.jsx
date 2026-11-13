// Bloco "Alterar senha" de Configurações da conta e de Ajuda e suporte. A
// alteração de senha ainda está sendo desenvolvida, então o botão fica
// desativado, com o aviso "Em breve".
function PasswordResetCard({ id, title = 'Senha', label = 'Alterar senha' }) {
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
            Este recurso ainda está sendo desenvolvido e ficará disponível em breve.
          </p>
        </div>
        <span
          aria-disabled="true"
          className="shrink-0 rounded-lg bg-companion-border/50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-companion-muted"
        >
          Em breve
        </span>
      </div>
    </section>
  )
}

export default PasswordResetCard
