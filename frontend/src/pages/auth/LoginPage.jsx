import { useState } from 'react'
import GraphBackground from '../../components/GraphBackground.jsx'
import '../../styles/app.css'
import companionLogo from '../../assets/icon_companion.png'

const copyrightYear = new Date().getFullYear()

function BrandMark() {
  return (
    <img
      src={companionLogo}
      className="brand-mark"
      alt=""
    />
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M21.35 12.23c0-.71-.06-1.38-.18-2.03H12v3.86h5.24a4.49 4.49 0 0 1-1.95 2.95v2.45h3.15c1.84-1.69 2.91-4.18 2.91-7.23Z" />
      <path d="M12 21.75c2.63 0 4.84-.87 6.44-2.29l-3.15-2.45c-.87.58-1.98.94-3.29.94a5.8 5.8 0 0 1-5.44-4.02H3.31v2.53A9.75 9.75 0 0 0 12 21.75Z" />
      <path d="M6.56 13.93a5.86 5.86 0 0 1 0-3.86V7.54H3.31a9.75 9.75 0 0 0 0 8.92l3.25-2.53Z" />
      <path d="M12 6.05c1.43 0 2.72.49 3.73 1.47l2.8-2.8A9.34 9.34 0 0 0 12 2.25a9.75 9.75 0 0 0-8.69 5.29l3.25 2.53A5.8 5.8 0 0 1 12 6.05Z" />
    </svg>
  )
}

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const canSubmit = username.trim().length > 0 && password.length > 0

  function showPreviewNotice() {
    setNotice('Esta funcionalidade estará disponível em breve.')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (canSubmit) showPreviewNotice()
  }

  return (
    <div className="login-page">
      <GraphBackground />
      <div className="ambient-glow ambient-glow--orange" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--orange-secondary" aria-hidden="true" />
      <div className="graph-veil" aria-hidden="true" />

      <header className="site-header">
        <div className="site-brand">
          <BrandMark />
          <span className="brand-name">COMPANION</span>
        </div>
      </header>

      <main className="login-main">
        <div className="login-column">
          <section className="login-card" aria-labelledby="login-title">
            <div className="login-heading">
              <span className="eyebrow">BEM-VINDO</span>
              <h1 id="login-title">Entre na sua conta.</h1>
              <p>Continue tirando suas dúvidas.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="login-username">Usuário</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="usuario@edu.unifor.br"
                  value={username}
                  onChange={(event) => { setUsername(event.target.value); setNotice('') }}
                />
              </div>

              <div className="field-group">
                <div className="field-heading">
                  <label htmlFor="login-password">Senha</label>
                  <button className="text-button forgot-button" type="button" onClick={showPreviewNotice}>Esqueceu a senha?</button>
                </div>
                <div className="password-field">
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="password"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setNotice('') }}
                  />
                </div>
              </div>

              <button className="submit-button" type="submit" disabled={!canSubmit}>Entrar <span aria-hidden="true"></span></button>
            </form>

            <div className="signup-row">
              <span>Ainda não possui conta?</span>
              <button className="text-button" type="button" onClick={showPreviewNotice}>Criar conta</button>
            </div>

            <div className="divider"><span>ou</span></div>

            <p className="alternate-label">Acessar conta com</p>
            <button className="google-button" type="button" onClick={showPreviewNotice}>
              <GoogleIcon />
              <span>Continuar com Google</span>
            </button>

            {notice && <p className="preview-notice" role="status">{notice}</p>}
          </section>

          <footer className="login-footer">  Companion &copy; {copyrightYear} Alguns dos direitos reservados. </footer>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
