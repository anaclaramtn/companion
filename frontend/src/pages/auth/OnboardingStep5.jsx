import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

const MAX_BIO = 200

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
  const [done, setDone] = useState(false)

  const bioError = bioTouched || submitted ? validateBio(bio) : ''

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (validateBio(bio)) return

    // O envio dos dados à API ainda precisa ser conectado.
    setDone(true)
  }

  if (done) return <Navigate to="/feed" />

  return (
    <AuthLayout>
      <div
        className="onboarding-progress"
        role="progressbar"
        aria-label="Progresso do cadastro"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={100}
      >
        <div className="onboarding-progress-bar" style={{width: '100%'}} />
      </div>

      <AuthForm
        eyebrow="ETAPA 5 DE 5"
        title="Conte um pouco sobre você"
        description="Você poderá completar ou alterar essas informações depois."
        fields={[
          {
            id: 'onboarding-bio',
            name: 'bio',
            label: 'Biografia',
            type: 'textarea',
            rows: 8,
            maxLength: MAX_BIO,
            labelAction: <span className="bio-counter">{bio.length}/{MAX_BIO}</span>,
            placeholder: 'Escreva aqui, como se fosse uma carta...',
            value: bio,
            error: bioError,
            onChange: (value) => setBio(value),
            onBlur: () => setBioTouched(true),
          },
        ]}
        submitLabel="Concluir"
        canSubmit
        onSubmit={handleSubmit}
        actions={{
          start: (
            <Link className="text-button" to="/onboarding/etapa-4">
              Voltar
            </Link>
          ),
          extra: (
            <Link className="text-button skip-button" to="/feed">
              Pular
            </Link>
          ),
        }}
      />
    </AuthLayout>
  )
}

export default OnboardingStep5Page