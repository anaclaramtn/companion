import { Link } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import FaqItem from '../../components/common/FaqItem.jsx'
import OptionList from '../../components/common/OptionList.jsx'
import PasswordResetCard from '../../components/user/PasswordResetCard.jsx'
import {
  mockSupportShortcuts,
  mockSupportTopics,
} from '../../data/mockSupport.js'
import { SUPPORT_EMAIL } from '../../data/support.js'

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
            Consulte as dúvidas frequentes e, se não resolver, envie um ticket
            para a equipe do Companion. Para conteúdos inadequados, use a
            denúncia na própria dúvida ou resposta.
          </p>
          <Link
            to="/faq"
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-companion-brand hover:underline"
          >
            <i className="bi bi-send" aria-hidden="true" />
            Enviar um ticket
          </Link>
          <p className="mt-2 text-xs text-companion-muted">
            Ou escreva para{' '}
            <a className="break-all font-bold text-companion-brand hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </section>
  )
}

export default SupportPage
