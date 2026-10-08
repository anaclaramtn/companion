import { useEffect, useState } from 'react'
import GraphBackground from '../../components/GraphBackground.jsx'
import '../../styles/app.css'
import googleIcon from '../../assets/google_icon.svg'
import eyeFrame00 from '../../assets/eye-frames/frame_00.png'
import eyeFrame01 from '../../assets/eye-frames/frame_01.png'
import eyeFrame02 from '../../assets/eye-frames/frame_02.png'
import eyeFrame03 from '../../assets/eye-frames/frame_03.png'
import eyeFrame04 from '../../assets/eye-frames/frame_04.png'
import eyeFrame06 from '../../assets/eye-frames/frame_06.png'

const copyrightYear = new Date().getFullYear()
const eyeFrames = [eyeFrame00, eyeFrame01, eyeFrame02, eyeFrame03, eyeFrame04, eyeFrame06]
const blinkSequence = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]

function BrandMark() {
  const [sequenceIndex, setSequenceIndex] = useState(0)

  useEffect(() => {
    const isEyeOpen = blinkSequence[sequenceIndex] === 0
    const timer = window.setTimeout(
      () => setSequenceIndex((current) => (current + 1) % blinkSequence.length),
      isEyeOpen ? 1200 : 55,
    )

    return () => window.clearTimeout(timer)
  }, [sequenceIndex])

  return (
    <span className="brand-mark" aria-hidden="true">
      {eyeFrames.map((frame, index) => (
        <img
          key={frame}
          src={frame}
          className={blinkSequence[sequenceIndex] === index ? 'is-visible' : ''}
          alt=""
        />
      ))}
    </span>
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
          <span className="brand-name">Companion</span>
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
                    placeholder="********"
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
              <img src={googleIcon} alt="" width="20" height="20" aria-hidden="true" />
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
