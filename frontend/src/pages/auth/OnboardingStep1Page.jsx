import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

function validateFullName(value) {
  const name = value.trim()

  if (!name) {
    return 'O campo de nome completo é obrigatório.'
  }

  if (name.length < 3) {
    return 'O nome deve ter pelo menos 3 caracteres.'
  }

  return ''
}

function validateUsername(value) {
  const username = value.trim()

  if (!username) {
    return 'O campo de username é obrigatório.'
  }

  if (username.length < 3) {
    return 'O username deve ter pelo menos 3 caracteres.'
  }

  if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
    return 'Use apenas letras, números, ponto ou underline.'
  }

  return ''
}

function OnboardingStep1Page() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')

  const [fullNameTouched, setFullNameTouched] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const fullNameError =
    fullNameTouched || submitted ? validateFullName(fullName) : ''

  const usernameError =
    usernameTouched || submitted ? validateUsername(username) : ''

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    const hasErrors = validateFullName(fullName) || validateUsername(username)

    if (hasErrors) return

    // O envio à API ainda precisa ser conectado.
    setDone(true)
  }

  if (done) return <Navigate to="/onboarding/etapa-2" />

  return (
    <AuthLayout>
      <form className="onboarding-card" onSubmit={handleSubmit} noValidate>
        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" style={{width: '20%'}} />
        </div>

        <p className="eyebrow">ETAPA 1 DE 5</p>
        <h1>Como devemos chamar você?</h1>

        <div className="form-field">
          <label htmlFor="onboarding-full-name">Nome completo *</label>
          <input
            id="onboarding-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Como você quer ser chamado"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            onBlur={() => setFullNameTouched(true)}
          />
          {fullNameError && <p className="field-error">{fullNameError}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="onboarding-username">Username *</label>
          <input
            id="onboarding-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="@seu.username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => setUsernameTouched(true)}
          />
          {usernameError && <p className="field-error">{usernameError}</p>}
        </div>

        <div className="onboarding-actions">
          <Link className="text-button" to="/login">
            Cancelar
          </Link>

          <div>
            <button type="submit">Avançar</button>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default OnboardingStep1Page