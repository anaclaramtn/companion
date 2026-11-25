import { useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import { useFinishSignIn } from '../../features/auth/useFinishSignIn.js'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import { getAuthErrorMessage } from '../../services/apiError.js'

function LoginPage() {
  const navigate = useNavigate()
  const finishSignIn = useFinishSignIn()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const canSubmit = email.trim().length > 0 && password.length > 0

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setMessage('')
    setIsSubmitting(true)
    try {
      finishSignIn(await login(email.trim(), password))
    } catch (error) {
      if (error.code === 'companion/email-not-verified') {
        navigate('/confirmar-email', { state: { email: email.trim() } })
        return
      }
      setMessage(getAuthErrorMessage(error, 'Não foi possível entrar. Tente novamente.'))
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
            id: 'login-email',
            name: 'email',
            label: 'E-mail',
            type: 'email',
            autoComplete: 'username',
            placeholder: 'usuario@edu.unifor.br',
            value: email,
            onChange: (value) => {
              setEmail(value)
              setMessage('')
            },
            trailing: <i className="bi bi-envelope" aria-hidden="true" />,
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
