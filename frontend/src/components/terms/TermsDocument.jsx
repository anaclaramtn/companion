import { terms } from '../../data/terms.js'

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Título, data da última atualização e o texto dos Termos e da Política de
// Privacidade. Usado dentro do app (/termos) e na página pública do cadastro.
function TermsDocument({ titleId = 'terms-title' }) {
  return (
    <>
      <div>
        <h1
          id={titleId}
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Termos de uso e política de privacidade
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Última atualização em {formatDate(terms.updatedAt)}
        </p>
      </div>

      <article className="space-y-6 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-8">
        {terms.sections.map((section, index) => (
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
    </>
  )
}

export default TermsDocument
