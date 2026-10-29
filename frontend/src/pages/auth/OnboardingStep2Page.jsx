import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

function validatePhoto(file) {
  if (!file) return ''

  if (!file.type.startsWith('image/')) {
    return 'Escolha um arquivo de imagem.'
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'A imagem deve ter no máximo 5 MB.'
  }

  return ''
}

function DefaultAvatar() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="46" r="17" fill="#9ca0b0" />
      <path d="M26 110C26 86 42 74 60 74S94 86 94 110Z" fill="#9ca0b0" />
    </svg>
  )
}

function OnboardingStep2Page() {
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const photoError = submitted ? validatePhoto(photo) : ''

  function handleChoosePhoto(event) {
    const file = event.target.files[0]

    if (!file) return

    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (validatePhoto(photo)) return

    // O envio da foto à API ainda precisa ser conectado.
    setDone(true)
  }

  if (done) return <Navigate to="/onboarding/etapa-3" />

  return (
    <AuthLayout>
      <form className="onboarding-card" onSubmit={handleSubmit} noValidate>
        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" style={{width: '40%'}} />
        </div>

        <p className="eyebrow">ETAPA 2 DE 5</p>
        <h1>Escolha sua foto</h1>
        <p className="description">
          Você poderá completar ou alterar essas informações depois.
        </p>

        <div className="photo-picker">
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
            {preview ? (
              <img
                src={preview}
                alt="Sua foto"
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              <DefaultAvatar />
            )}
          </div>

          <label className="text-button" htmlFor="onboarding-photo">
            Escolher foto
          </label>
          <input
            id="onboarding-photo"
            name="photo"
            type="file"
            accept="image/*"
            hidden
            onChange={handleChoosePhoto}
          />

          {photoError && <p className="field-error">{photoError}</p>}

          <p className="helper">
            Se você pular esta etapa, usaremos a imagem padrão de usuário.
          </p>
        </div>

        <div className="onboarding-actions">
          <Link className="text-button" to="/onboarding/etapa-1">
            Voltar
          </Link>

          <div>
            <Link className="text-button" to="/onboarding/etapa-3">
              Pular
            </Link>
            <button type="submit">Avançar</button>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default OnboardingStep2Page