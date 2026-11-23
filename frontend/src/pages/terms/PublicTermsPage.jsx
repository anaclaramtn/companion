import { Link } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Background from '../../components/common/Background.jsx'
import TermsDocument from '../../components/terms/TermsDocument.jsx'

// Os mesmos termos, abertos sem login: o cadastro precisa mostrá-los antes de
// a pessoa ter uma conta.
function PublicTermsPage() {
  return (
    <Background>
      <main className="mx-auto min-h-dvh w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
        <Link
          to="/criar-conta"
          className="inline-flex items-center gap-2 text-sm font-semibold text-companion-muted transition-colors hover:text-companion-text"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Voltar ao cadastro
        </Link>
        <TermsDocument />
      </main>
    </Background>
  )
}

export default PublicTermsPage
