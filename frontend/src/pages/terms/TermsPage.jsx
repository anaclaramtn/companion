import BackLink from '../../components/common/BackLink.jsx'
import TermsDocument from '../../components/terms/TermsDocument.jsx'

// Termos e política de privacidade, dentro do app (Configurações).
function TermsPage() {
  return (
    <section aria-labelledby="terms-title" className="space-y-5">
      <BackLink to="/configuracoes" label="Configurações" />
      <TermsDocument />
    </section>
  )
}

export default TermsPage
