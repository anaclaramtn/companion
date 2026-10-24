import { useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { Link } from 'react-router'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const canSubmit = username.trim().length > 0 && password.length > 0

  function clearNotice(setValue) {
    return (value) => {
      setValue(value)
      setNotice('')
    }
  }

  function showPreviewNotice() {
    setNotice('Esta funcionalidade estará disponível em breve.')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (canSubmit) showPreviewNotice()
  }

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="BEM-VINDO"
        title="Entre na sua conta."
        description="Continue tirando suas dúvidas."
        fields={[
          {
            id: 'login-username',
            name: 'username',
            label: 'Usuário',
            autoComplete: 'username',
            placeholder: 'usuario@edu.unifor.br',
            value: username,
            onChange: clearNotice(setUsername),
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
            onChange: clearNotice(setPassword),
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
        message={notice}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
        footer={(
          <div className="signup-row">
            <span>Ainda não possui conta?</span>
            <button className="text-button" type="button" onClick={showPreviewNotice}>
              Criar conta
            </button>
          </div>
        )}
      />
    </AuthLayout>
  )
}

export default LoginPage
