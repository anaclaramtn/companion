import BackLink from '../../components/common/BackLink.jsx'
import FaqItem from '../../components/common/FaqItem.jsx'
import OptionList from '../../components/common/OptionList.jsx'
import PasswordResetCard from '../../components/user/PasswordResetCard.jsx'
import {
  mockSupportShortcuts,
  mockSupportTopics,
} from '../../data/mockSupport.js'

function SupportPage() {
  return (
    <section aria-labelledby="support-title" className="space-y-5">
      <div>
        <BackLink to="/configuracoes" label="Configurações" />
        <h1
          id="support-title"
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Ajuda e suporte
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Encontre soluções para os problemas mais comuns.
        </p>
      </div>

      <OptionList
        id="support-shortcuts"
        title="Atalhos"
        items={mockSupportShortcuts}
      />

      <PasswordResetCard id="support-password" label="Recuperar senha" />

      <section
        aria-labelledby="support-topics-title"
        className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
      >
        <h2
          id="support-topics-title"
          className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
        >
          Problemas comuns
        </h2>
        {mockSupportTopics.map((topic) => (
          <FaqItem
            key={topic.id}
            question={topic.question}
            answer={topic.answer}
          />
        ))}
      </section>

      <section
        aria-labelledby="support-contact-title"
        className="flex gap-4 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-companion-orange/10 text-lg text-companion-brand"
        >
          <i className="bi bi-envelope" />
        </span>
        <div>
          <h2
            id="support-contact-title"
            className="text-sm font-bold text-companion-text"
          >
            Ainda precisa de ajuda?
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-companion-muted">
            O contato direto com a equipe do Companion ainda não está
            disponível. Enquanto isso, consulte as dúvidas frequentes ou use a
            denúncia para avisar a moderação sobre conteúdos inadequados.
          </p>
        </div>
      </section>
    </section>
  )
}

export default SupportPage
