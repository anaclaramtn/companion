import { useState } from 'react'
import GraphBackground from '../../components/GraphBackground.jsx'
import '../../styles/app.css'
import companionLogo from '../../assets/icon_companion.png'
import googleIcon from '../../assets/google_icon.svg'

const copyrightYear = new Date().getFullYear()

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notice, setNotice] = useState('')

  const rules = [
    { label: 'Mínimo de 8 caracteres', valid: password.length >= 8 },
    { label: 'Pelo menos um número', valid: /\d/.test(password) },
    { label: 'Uma letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(password) },
  ]

  const canSubmit =
    email.trim() !== '' &&
    rules.every((rule) => rule.valid) &&
    confirmPassword !== '' &&
    password === confirmPassword

  function handleSubmit(event) {
    event.preventDefault()
    if (canSubmit) setNotice('Cadastro pronto para integração com o servidor.')
  }

  function showNotice() {
    setNotice('Esta funcionalidade estará disponível em breve.')
  }

  return (
    <div className="login-page">
      <GraphBackground />
      <div className="ambient-glow ambient-glow--orange" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--orange-secondary" aria-hidden="true" />
      <div className="graph-veil" aria-hidden="true" />

      <header className="site-header">
        <div className="site-brand">
          <img src={companionLogo} className="brand-mark" alt="" />
          <span className="brand-name">COMPANION</span>
        </div>
      </header>

      <main className="login-main">
        <div className="login-column">
          <section className="login-card" aria-labelledby="register-title">
            <div className="login-heading">
              <span className="eyebrow">JUNTE-SE A NÓS</span>
              <h1 id="register-title">Crie sua conta.</h1>
              <p>Comece sua jornada com o Companion.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="register-email">E-mail institucional</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="usuario@edu.unifor.br"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setNotice('')
                  }}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="register-password">Senha</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Crie uma senha segura"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setNotice('')
                  }}
                  aria-describedby="password-requirements"
                  required
                />

                <div id="password-requirements" className="password-requirements">
                  <p>Sua senha deve conter:</p>
                  {rules.map(({ label, valid }) => (
                    <p
                      key={label}
                      className={
                        !password ? 'password-rule' :
                        valid ? 'password-rule password-rule--valid' :
                        'password-rule password-rule--invalid'
                      }
                    >
                      {password ? (valid ? '✓' : '✕') : '○'} {label}
                    </p>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="register-confirm-password">Confirmar senha</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setNotice('')
                  }}
                  required
                />

                {confirmPassword && (
                  <p className={
                    password === confirmPassword
                      ? 'password-rule password-rule--valid'
                      : 'password-rule password-rule--invalid'
                  }>
                    {password === confirmPassword
                      ? '✓ As senhas coincidem.'
                      : '✕ As senhas não coincidem.'}
                  </p>
                )}
              </div>

              <button className="submit-button" type="submit" disabled={!canSubmit}>
                Criar conta <span aria-hidden="true" />
              </button>
            </form>

            <div className="signup-row">
              <span>Já possui uma conta?</span>
              <button
                className="text-button"
                type="button"
                onClick={() => { window.location.href = '/login' }}
              >
                Fazer login
              </button>
            </div>

            <div className="divider"><span>ou</span></div>
            <p className="alternate-label">Cadastre-se com</p>

            <button className="google-button" type="button" onClick={showNotice}>
              <img src={googleIcon} alt="" width="20" height="20" />
              <span>Continuar com Google</span>
            </button>

            {notice && <p className="preview-notice" role="status">{notice}</p>}
          </section>

          <footer className="login-footer">
            Companion &copy; {copyrightYear} Alguns dos direitos reservados.
          </footer>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage
