import { useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import { getApiErrorMessage } from '../../services/apiError.js'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const canSubmit = identifier.trim().length > 0 && password.length > 0

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setMessage('')
    setIsSubmitting(true)
    try {
      const session = await login(identifier.trim(), password)
      navigate(session.user.profileComplete ? '/feed' : '/onboarding/etapa-1', { replace: true })
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Não foi possível entrar. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="BEM-VINDO"
        title="Entre na sua conta."
        description="Continue tirando suas dúvidas."
        fields={[
          {
            id: 'login-identifier',
            name: 'identifier',
            label: 'E-mail ou username',
            autoComplete: 'username',
            placeholder: 'seu e-mail ou username',
            value: identifier,
            onChange: (value) => {
              setIdentifier(value)
              setMessage('')
            },
            trailing: <i className="bi bi-person" aria-hidden="true" />,
          },
          {
            id: 'login-password',
            name: 'password',
            label: 'Senha',
            type: showPassword ? 'text' : 'password',
            autoComplete: 'current-password',
            placeholder: '********',
            value: password,
            onChange: (value) => {
              setPassword(value)
              setMessage('')
            },
            labelAction: (
              <Link className="text-button forgot-button" to="/recuperar-senha">
                Esqueceu a senha?
              </Link>
            ),
            trailing: (
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
              </button>
            ),
          },
        ]}
        submitLabel="Entrar"
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
        footer={(
          <div className="signup-row">
            <span>Ainda não possui conta?</span>
            <Link className="text-button" to="/criar-conta">
              Criar conta
            </Link>
          </div>
        )}
      />
    </AuthLayout>
  )
}

export default LoginPage
