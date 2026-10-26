import AuthBackground from '../../features/auth/components/AuthBackground.jsx'
import AuthBrand from '../../features/auth/components/AuthBrand.jsx'
import '../../styles/app.css'
import './AuthLayout.css'

const copyrightYear = new Date().getFullYear()

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="ambient-glow ambient-glow--orange" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--orange-secondary" aria-hidden="true" />
      <div className="graph-veil" aria-hidden="true" />

      <AuthBrand />

      <main className="auth-main">
        <div className="auth-column">
          {children}
          <footer className="auth-footer">
            Companion &copy; {copyrightYear} Alguns dos direitos reservados.
          </footer>
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
