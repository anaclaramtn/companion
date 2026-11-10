import { useEffect, useState } from 'react'
import BackLink from '../../components/common/BackLink.jsx'
import FaqItem from '../../components/common/FaqItem.jsx'
import { getApiErrorMessage } from '../../services/apiError.js'
import { getFaqs } from '../../services/faqService.js'

// Dúvidas frequentes vindas do banco (GET /api/faqs).
function FaqPage() {
  const [reloadKey, setReloadKey] = useState(0)
  const [request, setRequest] = useState({ key: null, faqs: [], error: '' })
  const isLoading = request.key !== reloadKey

  useEffect(() => {
    let active = true
    getFaqs()
      .then((faqs) => {
        if (active) setRequest({ key: reloadKey, faqs, error: '' })
      })
      .catch((error) => {
        if (!active) return
        setRequest({
          key: reloadKey,
          faqs: [],
          error: getApiErrorMessage(error, 'Não foi possível carregar as dúvidas frequentes.'),
        })
      })
    return () => {
      active = false
    }
  }, [reloadKey])

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
        {isLoading ? (
          <p role="status" className="px-6 py-8 text-sm text-companion-muted">
            Carregando dúvidas frequentes…
          </p>
        ) : request.error ? (
          <div role="alert" className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <p className="text-sm font-semibold text-red-700">{request.error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
            >
              Tentar novamente
            </button>
          </div>
        ) : request.faqs.length > 0 ? (
          request.faqs.map((faq) => (
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
