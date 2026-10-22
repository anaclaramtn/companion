import { useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './LoginCard.css'

function LoginCard({
  username,
  password,
  notice,
  canSubmit,
  onUsernameChange,
  onPasswordChange,
  onShowPreviewNotice,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="login-card" aria-labelledby="login-title">
      <div className="login-heading">
        <span className="eyebrow">BEM-VINDO</span>
        <h1 id="login-title">Entre na sua conta.</h1>
        <p>Continue tirando suas dúvidas.</p>
      </div>

      <form className="login-form" onSubmit={onSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="login-username">Usuário</label>
          <div className="input-with-icon">
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="usuario@edu.unifor.br"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
            />
            <i className="bi bi-person input-icon" aria-hidden="true" />
          </div>
        </div>

        <div className="field-group">
          <div className="field-heading">
            <label htmlFor="login-password">Senha</label>
            <button className="text-button forgot-button" type="button" onClick={onShowPreviewNotice}>Esqueceu a senha?</button>
          </div>
          <div className="password-field">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="********"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
            <button
              className="password-visibility-button"
              type="button"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <button className="submit-button" type="submit" disabled={!canSubmit}>Entrar <span aria-hidden="true"></span></button>
      </form>

      <div className="signup-row">
        <span>Ainda não possui conta?</span>
        <button className="text-button" type="button" onClick={onShowPreviewNotice}>Criar conta</button>
      </div>

      {/* <div className="divider"><span>ou</span></div>

      <p className="alternate-label">Acessar conta com</p>
      <button className="google-button" type="button" onClick={onShowPreviewNotice}>
        <img src={googleIcon} alt="" width="20" height="20" aria-hidden="true" />
        <span>Continuar com Google</span>
      </button> */}

      {notice && <p className="preview-notice" role="status">{notice}</p>}
    </section>
  )
}

export default LoginCard
