import {useState} from 'react'
import {Link} from 'react-router'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

const MAX_BIO = 300

function validateBio(value) {
  if (value.length > MAX_BIO) {
    return `A biografia deve ter no máximo ${MAX_BIO} caracteres.`
  }

  return ''
}

function OnboardingStep5Page() {
  const [bio, setBio] = useState('')
  const [bioTouched, setBioTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  const bioError = bioTouched || submitted ? validateBio(bio) : ''

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setMessage('')

    if (validateBio(bio)) return

    // TODO: enviar os dados à API e trocar a mensagem por um estado done + <Navigate to="/rota-da-proxima-pagina" />
    setMessage('Cadastro concluído! O redirecionamento ainda não foi conectado.')
  }

  function handleSkip() {
    // TODO: quando a próxima página existir, trocar este botão por <Link to="/rota-da-proxima-pagina">
    setMessage('Etapa ignorada. O redirecionamento ainda não foi conectado.')
  }

  return (
    <AuthLayout>
      <form className="onboarding-card" onSubmit={handleSubmit} noValidate>
        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" style={{width: '100%'}} />
        </div>

        <p className="eyebrow">ETAPA 5 DE 5</p>
        <h1>Conte um pouco sobre você</h1>
        <p className="description">
          Você poderá completar ou alterar essas informações depois.
        </p>

        <div className="form-field">
          <label htmlFor="onboarding-bio">Biografia</label>
          <textarea
            id="onboarding-bio"
            name="bio"
            rows={4}
            placeholder="Conte um pouco sobre você"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            onBlur={() => setBioTouched(true)}
          />
          {bioError && <p className="field-error">{bioError}</p>}
        </div>

        {message && <p className="form-message">{message}</p>}

        <div className="onboarding-actions">
          <Link className="text-button" to="/onboarding/etapa-4">
            Voltar
          </Link>

          <div>
            <button type="button" className="text-button" onClick={handleSkip}>
              Pular
            </button>
            <button type="submit">Concluir</button>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default OnboardingStep5Page