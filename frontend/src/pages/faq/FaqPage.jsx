import BackLink from '../../components/common/BackLink.jsx'
import FaqItem from '../../components/common/FaqItem.jsx'
import { mockFaqs } from '../../data/mockFaqs.js'

function FaqPage() {
  return (
    <section aria-labelledby="faq-title" className="space-y-5">
      <div>
        <BackLink to="/configuracoes" label="Configurações" />
        <h1
          id="faq-title"
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Dúvidas frequentes
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Respostas rápidas sobre como usar o Companion.
        </p>
      </div>

      <section
        aria-label="Perguntas frequentes"
        className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
      >
        {mockFaqs.length > 0 ? (
          mockFaqs.map((faq) => (
            <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))
        ) : (
          <p role="status" className="px-6 py-8 text-sm text-companion-muted">
            Não há dúvidas frequentes disponíveis no momento.
          </p>
        )}
      </section>
    </section>
  )
}

export default FaqPage
