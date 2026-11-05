import BackLink from '../../components/common/BackLink.jsx'
import { mockTerms } from '../../data/mockTerms.js'

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function TermsPage() {
  return (
    <section aria-labelledby="terms-title" className="space-y-5">
      <div>
        <BackLink to="/configuracoes" label="Configurações" />
        <h1
          id="terms-title"
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Termos e condições
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Última atualização em {formatDate(mockTerms.updatedAt)}
        </p>
      </div>

      <p
        role="note"
        className="flex items-center gap-2 rounded-xl bg-companion-orange/10 px-4 py-3 text-xs font-semibold text-companion-brand"
      >
        <i className="bi bi-info-circle" aria-hidden="true" />
        Documento ilustrativo, criado apenas para demonstração do protótipo.
      </p>

      <article className="space-y-6 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-8">
        {mockTerms.sections.map((section, index) => (
          <section key={section.id} aria-labelledby={`terms-${section.id}`}>
            <h2
              id={`terms-${section.id}`}
              className="text-base font-bold text-companion-text"
            >
              {index + 1}. {section.title}
            </h2>
            <div className="mt-2 space-y-2">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-companion-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </section>
  )
}

export default TermsPage
