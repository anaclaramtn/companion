import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
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
      <div
        className="onboarding-progress"
        role="progressbar"
        aria-label="Progresso do cadastro"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={20}
      >
        <div className="onboarding-progress-bar" style={{width: '20%'}} />
      </div>

      <AuthForm
        eyebrow="ETAPA 1 DE 5"
        title="Como devemos chamar você?"
        fields={[
          {
            id: 'onboarding-full-name',
            name: 'fullName',
            label: 'Nome completo *',
            type: 'text',
            autoComplete: 'name',
            placeholder: 'Como você quer ser chamado',
            value: fullName,
            required: true,
            error: fullNameError,
            onChange: (value) => setFullName(value),
            onBlur: () => setFullNameTouched(true),
          },
          {
            id: 'onboarding-username',
            name: 'username',
            label: 'Username *',
            type: 'text',
            autoComplete: 'username',
            placeholder: '@seu.username',
            value: username,
            required: true,
            error: usernameError,
            onChange: (value) => setUsername(value),
            onBlur: () => setUsernameTouched(true),
          },
        ]}
        submitLabel="Avançar"
        canSubmit
        onSubmit={handleSubmit}
        actions={{
          start: (
            <Link className="text-button" to="/login">
              Cancelar
            </Link>
          ),
        }}
      />
    </AuthLayout>
  )
}

export default OnboardingStep1Page
