import { useState } from 'react'
import GraphBackground from '../../../components/fluxoAuth/GraphBackground.jsx'
import LoginBrand from '../../../components/fluxoAuth/LoginBrand.jsx'
import LoginCard from '../../../components/fluxoAuth/LoginCard.jsx'
import '../../../styles/app.css'
import './LoginPage.css'

const copyrightYear = new Date().getFullYear()

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

      <LoginBrand />

      <main className="login-main">
        <div className="login-column">
          <LoginCard
            username={username}
            password={password}
            notice={notice}
            canSubmit={canSubmit}
            onUsernameChange={(value) => { setUsername(value); setNotice('') }}
            onPasswordChange={(value) => { setPassword(value); setNotice('') }}
            onShowPreviewNotice={showPreviewNotice}
            onSubmit={handleSubmit}
          />

          <footer className="login-footer">  Companion &copy; {copyrightYear} Alguns dos direitos reservados. </footer>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
