import {useState} from 'react'
import {Link, useNavigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getApiErrorMessage } from '../../services/apiError.js'

function validateFullName(value) {
  const name = value.trim()

  if (!name) {
    return 'O campo de nome completo é obrigatório.'
  }

  if (name.length < 3) {
    return 'O nome deve ter pelo menos 3 caracteres.'
  }
  if (name.length > 120) {
    return 'O nome deve ter no máximo 120 caracteres.'
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

  if (!/^@?[a-zA-Z0-9]{3,30}$/.test(username)) {
    return 'Use de 3 a 30 letras ou números. O @ no início é opcional.'
  }

  return ''
}

function OnboardingStep1Page() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')

  const [fullNameTouched, setFullNameTouched] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const fullNameError =
    fullNameTouched || submitted ? validateFullName(fullName) : ''

  const usernameError =
    usernameTouched || submitted ? validateUsername(username) : ''

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setMessage('')

    const hasErrors = validateFullName(fullName) || validateUsername(username)

    if (hasErrors || isSubmitting) return

    setIsSubmitting(true)
    try {
      await updateProfile({ name: fullName.trim(), username: username.trim() })
      navigate('/onboarding/etapa-2')
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Não foi possível salvar seu perfil. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="PERFIL OBRIGATÓRIO"
        title="Como devemos chamar você?"
        description="Informe seu nome e escolha um username para continuar."
        fields={[
          {
            id: 'onboarding-full-name',
            name: 'fullName',
            label: 'Nome completo *',
            type: 'text',
            autoComplete: 'name',
            placeholder: 'Como você quer ser chamado',
            maxLength: 120,
            value: fullName,
            required: true,
            error: fullNameError,
            onChange: (value) => {
              setFullName(value)
              setMessage('')
            },
            onBlur: () => setFullNameTouched(true),
          },
          {
            id: 'onboarding-username',
            name: 'username',
            label: 'Username *',
            type: 'text',
            autoComplete: 'username',
            placeholder: '@seuusername',
            maxLength: 31,
            value: username,
            required: true,
            error: usernameError,
            onChange: (value) => {
              setUsername(value)
              setMessage('')
            },
            onBlur: () => setUsernameTouched(true),
          },
        ]}
        submitLabel="Avançar"
        canSubmit
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
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
