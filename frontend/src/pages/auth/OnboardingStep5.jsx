import {useState} from 'react'
import {Link, useNavigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getApiErrorMessage } from '../../services/apiError.js'

// Mesmo limite do backend (UserProfileUpdateRequestDTO).
const MAX_BIO = 512

function validateBio(value) {
  if (value.length > MAX_BIO) {
    return `A biografia deve ter no máximo ${MAX_BIO} caracteres.`
  }

  return ''
}

function OnboardingStep5Page() {
  const navigate = useNavigate()
  const { user, updateProfile, completeOnboarding } = useAuth()
  // Começa com a bio já salva, para quem volta a esta etapa.
  const [bio, setBio] = useState(user?.bio ?? '')
  const [bioTouched, setBioTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const bioError = bioTouched || submitted ? validateBio(bio) : ''

  async function finishOnboarding(saveBio) {
    if (isSubmitting) return

    setMessage('')
    setIsSubmitting(true)
    try {
      // Só envia a bio se ela mudou. Texto vazio apaga a bio salva.
      const newBio = bio.trim()
      if (saveBio && newBio !== (user?.bio ?? '')) {
        await updateProfile({ bio: newBio })
      }
      await completeOnboarding()
      // Fim da criação de perfil: substitui o histórico para que "voltar" no
      // navegador não leve de novo às etapas depois de entrar no feed.
      navigate('/feed', { replace: true })
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Não foi possível concluir esta etapa. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (validateBio(bio)) return

    finishOnboarding(true)
  }

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
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
        actions={{
          start: (
            <Link className="text-button" to="/onboarding/etapa-4">
              Voltar
            </Link>
          ),
          extra: (
            <button
              className="text-button skip-button"
              type="button"
              onClick={() => finishOnboarding(false)}
              disabled={isSubmitting}
            >
              Pular
            </button>
          ),
        }}
      />
    </AuthLayout>
  )
}

export default OnboardingStep5Page
