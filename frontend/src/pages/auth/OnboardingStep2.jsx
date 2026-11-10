import {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  AVATAR_ACCEPT,
  AVATAR_SIZE_MESSAGE,
  getAvatarFileError,
  isAvatarTooLargeError,
} from '../../services/profileService.js'

function DefaultAvatar() {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      style={{display: 'block', width: '100%', height: '100%'}}
    >
      <circle cx="60" cy="46" r="19" fill="#9ca0b0" />
      <path d="M6 132C6 96 30 78 60 78S114 96 114 132Z" fill="#9ca0b0" />
    </svg>
  )
}

function OnboardingStep2Page() {
  const { user, updateAvatar } = useAuth()
  const showToast = useToast()
  const [photo, setPhoto] = useState(null)
  // Endereço temporário (blob:) da foto escolhida, só para a pré-visualização.
  const [preview, setPreview] = useState(null)
  const [done, setDone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Libera da memória a pré-visualização anterior ao trocar de foto ou sair.
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  // Ao voltar para esta etapa, mostra a foto que já foi enviada.
  const shownPhoto = preview ?? user?.avatarUrl

  function handleChoosePhoto(event) {
    const file = event.target.files?.[0]
    // Limpa o campo para que escolher o mesmo arquivo de novo dispare o onChange.
    event.target.value = ''
    if (!file) return

    const fileError = getAvatarFileError(file)
    if (fileError) {
      showToast(fileError, { type: 'error' })
      return
    }

    setMessage('')
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    // Sem foto nova, mantém a atual (ou a padrão) e segue.
    if (!photo) {
      setDone(true)
      return
    }

    setMessage('')
    setIsSubmitting(true)
    try {
      await updateAvatar(photo)
      setDone(true)
    } catch (error) {
      if (isAvatarTooLargeError(error)) {
        showToast(AVATAR_SIZE_MESSAGE, { type: 'error' })
      } else {
        setMessage(getApiErrorMessage(error, 'Não foi possível enviar sua foto. Tente novamente.'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (done) return <Navigate to="/onboarding/etapa-3" />

  return (
    <AuthLayout>
      <div
        className="onboarding-progress"
        role="progressbar"
        aria-label="Progresso do cadastro"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={40}
      >
        <div className="onboarding-progress-bar" style={{width: '40%'}} />
      </div>

      <AuthForm
        eyebrow="ETAPA 2 DE 5"
        title="Escolha sua foto"
        description="Você poderá completar ou alterar essas informações depois."
        fields={[]}
        submitLabel="Avançar"
        canSubmit
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
        actions={{
          start: (
            <Link className="text-button" to="/onboarding/etapa-1">
              Voltar
            </Link>
          ),
          extra: (
            <Link className="text-button skip-button" to="/onboarding/etapa-3">
              Pular
            </Link>
          ),
        }}
      >
        <div className="photo-picker" style={{textAlign: 'center'}}>
          <div
            className="avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 1rem',
              background: '#f1f2f5',
              border: '4px solid #ffe6cc',
            }}
          >
            {shownPhoto ? (
              <img
                src={shownPhoto}
                alt="Sua foto"
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              <DefaultAvatar />
            )}
          </div>

          <label className="text-button" htmlFor="onboarding-photo">
            {shownPhoto ? 'Trocar foto' : 'Escolher foto'}
          </label>
          <input
            id="onboarding-photo"
            name="photo"
            type="file"
            accept={AVATAR_ACCEPT}
            hidden
            onChange={handleChoosePhoto}
          />

          <p className="helper" style={{margin: '0.75rem 0 0', color: '#777783', fontSize: '0.85rem'}}>
            JPG, PNG ou WEBP com até 2 MB. Se você pular esta etapa, usaremos a
            imagem padrão de usuário.
          </p>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}

export default OnboardingStep2Page
