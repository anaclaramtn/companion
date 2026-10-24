import {useState} from 'react'
import {Link} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

function validateEmail(value) {
    const email = value.trim()

    if (!email) {
        return 'O campo de e-mail é obrigatório.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        return 'Por favor, insira um endereço de e-mail válido.'
    }

    return ''   
}

function validatePassword(value) {
    if (!value) {
        return 'Informe uma senha.'
    }

    if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
    if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula.'
    if (!/[a-z]/.test(value)) return 'A senha deve conter pelo menos uma letra minúscula.'
    if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número.'
    //if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'A senha deve conter pelo menos um caractere especial.'
    //nao sei se vai ter caractere especial
    return ''
}

function validatePasswordConfirmation(password, confirmation) {
  if (!confirmation) {
    return 'Confirme sua senha.'
  }

  if (password !== confirmation) {
    return 'As senhas não coincidem.'
  }

  return ''
}

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmationTouched, setConfirmationTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  const emailError =
    emailTouched || submitted ? validateEmail(email) : ''

  const passwordError =
    passwordTouched || submitted ? validatePassword(password) : ''

  const confirmationError =
    confirmationTouched || submitted
      ? validatePasswordConfirmation(password, passwordConfirmation)
      : ''

      function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setMessage('')

    const hasErrors =
      validateEmail(email) ||
      validatePassword(password) ||
      validatePasswordConfirmation(password, passwordConfirmation)

    if (hasErrors) return

    // A validação passou. O cadastro ainda precisa ser conectado à API.
    setMessage('Dados validados. O cadastro ainda não está conectado ao sistema.')
  }

  return (
    <AuthLayout>
      <AuthForm
        eyebrow="CRIAR CONTA"
        title="Cadastre-se."
        description="Use uma senha com 8 ou mais caracteres, incluindo maiúscula, minúscula e número."
        fields={[
          {
            id: 'register-email',
            name: 'email',
            label: 'E-mail',
            type: 'email',
            autoComplete: 'email',
            placeholder: 'usuario@edu.unifor.br',
            value: email,
            required: true,
            error: emailError,
            onChange: (value) => {
              setEmail(value)
              setMessage('')
            },
            onBlur: () => setEmailTouched(true),
          },
          {
            id: 'register-password',
            name: 'password',
            label: 'Senha',
            type: 'password',
            autoComplete: 'new-password',
            placeholder: 'Crie uma senha',
            value: password,
            required: true,
            error: passwordError,
            helper: ( 
              <ul className="password-requirements">
                <li>A senha deve ter pelo menos 8 caracteres.</li>
                <li>A senha deve conter pelo menos uma letra maiúscula.</li>
                <li>A senha deve conter pelo menos uma letra minúscula.</li>
                <li>A senha deve conter pelo menos um número.</li>
              </ul>
            ),
            onChange: (value) => {
              setPassword(value)
              setMessage('')
            },
            onBlur: () => setPasswordTouched(true),
          },
          {
            id: 'register-password-confirmation',
            name: 'passwordConfirmation',
            label: 'Confirmar senha',
            type: 'password',
            autoComplete: 'new-password',
            placeholder: 'Digite a senha novamente',
            value: passwordConfirmation,
            required: true,
            error: confirmationError,
            onChange: (value) => {
              setPasswordConfirmation(value)
              setMessage('')
            },
            onBlur: () => setConfirmationTouched(true),
          },
        ]}
        submitLabel="Criar conta"
        canSubmit
        onSubmit={handleSubmit}
        message={message}
        footer={
          <Link className="text-button" to="/login">
            Já tem uma conta? Entrar
          </Link>
        }
      />
    </AuthLayout>
  )
}

export default RegisterPage
